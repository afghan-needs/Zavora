document.addEventListener('DOMContentLoaded', async () => {
    const categorySelect = document.getElementById('category');
    const subcategorySelect = document.getElementById('subcategory');
    const locationSelect = document.getElementById('location');
    const form = document.querySelector('form');

    // =========================
    // Load Categories
    // =========================
    async function loadCategories() {
        categorySelect.innerHTML = '<option value="">در حال بارگذاری...</option>';

        const { data, error } = await supabaseClient
            .from('categories')
            .select(`
                id,
                is_active,
                category_translations (
                    name
                )
            `)
            .eq('is_active', true)
            .order('sort_order');

        if (error) {
            console.error('Categories error:', error);
            categorySelect.innerHTML =
                '<option value="">خطا در بارگذاری دسته‌بندی</option>';
            return;
        }

        categorySelect.innerHTML =
            '<option value="">انتخاب دسته‌بندی</option>';

        data.forEach(category => {
            const name =
                category.category_translations?.[0]?.name ||
                'بدون نام';

            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = name;

            categorySelect.appendChild(option);
        });
    }

    // =========================
    // Load Subcategories
    // =========================
    async function loadSubcategories(categoryId) {
        subcategorySelect.innerHTML =
            '<option value="">در حال بارگذاری...</option>';

        if (!categoryId) {
            subcategorySelect.innerHTML =
                '<option value="">ابتدا دسته‌بندی را انتخاب کنید</option>';
            return;
        }

        const { data, error } = await supabaseClient
            .from('subcategories')
            .select(`
                id,
                category_id,
                is_active,
                subcategory_translations (
                    name
                )
            `)
            .eq('category_id', categoryId)
            .eq('is_active', true)
            .order('sort_order');

        if (error) {
            console.error('Subcategories error:', error);
            subcategorySelect.innerHTML =
                '<option value="">خطا در بارگذاری زیردسته</option>';
            return;
        }

        subcategorySelect.innerHTML =
            '<option value="">انتخاب زیردسته</option>';

        data.forEach(subcategory => {
            const name =
                subcategory.subcategory_translations?.[0]?.name ||
                'بدون نام';

            const option = document.createElement('option');
            option.value = subcategory.id;
            option.textContent = name;

            subcategorySelect.appendChild(option);
        });
    }

    // =========================
    // Load Provinces
    // =========================
    async function loadLocations() {
        locationSelect.innerHTML =
            '<option value="">در حال بارگذاری...</option>';

        const { data, error } = await supabaseClient
            .from('administrative_units')
            .select(`
                id,
                name_english,
                name_native,
                code,
                is_active,
                administrative_levels!inner (
                    level_code
                )
            `)
            .eq('is_active', true)
            .eq('administrative_levels.level_code', 'province')
            .order('name_english');

        if (error) {
            console.error('Locations error:', error);
            locationSelect.innerHTML =
                '<option value="">خطا در بارگذاری ولایت‌ها</option>';
            return;
        }

        locationSelect.innerHTML =
            '<option value="">انتخاب ولایت</option>';

        data.forEach(location => {
            const option = document.createElement('option');

            option.value = location.id;
            option.textContent =
                location.name_native || location.name_english;

            locationSelect.appendChild(option);
        });
    }

    // =========================
    // Category Change
    // =========================
    categorySelect.addEventListener('change', async () => {
        await loadSubcategories(categorySelect.value);
    });

    // =========================
    // Submit Need
    // =========================
    if (form) {
        form.addEventListener('submit', async event => {
            event.preventDefault();

            const title =
                document.getElementById('title').value.trim();

            const description =
                document.getElementById('description').value.trim();

            const categoryId = categorySelect.value;
            const subcategoryId = subcategorySelect.value;
            const locationId = locationSelect.value;

            if (!title) {
                alert('عنوان نیاز را وارد کنید.');
                return;
            }

            if (!categoryId) {
                alert('دسته‌بندی را انتخاب کنید.');
                return;
            }

            if (!subcategoryId) {
                alert('زیردسته را انتخاب کنید.');
                return;
            }

            if (!locationId) {
                alert('ولایت را انتخاب کنید.');
                return;
            }

            const {
                data: userData,
                error: userError
            } = await supabaseClient.auth.getUser();

            if (userError || !userData.user) {
                alert('لطفاً ابتدا وارد حساب کاربری شوید.');
                return;
            }

            const { data, error } =
                await supabaseClient.rpc('create_need', {
                    p_user_id: userData.user.id,
                    p_title: title,
                    p_description: description || null,
                    p_category_id: categoryId,
                    p_subcategory_id: subcategoryId,
                    p_location_id: locationId,
                    p_status: 'active'
                });

            if (error) {
                console.error('Create need error:', error);
                alert('خطا در ثبت نیاز: ' + error.message);
                return;
            }

            alert('نیاز شما با موفقیت ثبت شد.');

            form.reset();

            subcategorySelect.innerHTML =
                '<option value="">ابتدا دسته‌بندی را انتخاب کنید</option>';
        });
    }

    // =========================
    // Start
    // =========================
    await Promise.all([
        loadCategories(),
        loadLocations()
    ]);
});
