document.addEventListener('DOMContentLoaded', async () => {

    const categorySelect =
        document.getElementById('category');

    const subcategorySelect =
        document.getElementById('subcategory');

    const locationSelect =
        document.getElementById('location');

    const form =
        document.getElementById('needForm');

    const message =
        document.getElementById('formMessage');

    const contactPhoneInput =
        document.getElementById('contactPhone');


    // ==========================================
    // Message
    // ==========================================

    function showMessage(text, type = '') {

        if (!message) return;

        message.textContent = text;

        message.className =
            'form-message ' + type;
    }


    // ==========================================
    // Authentication
    // ==========================================

    const authForm =
        document.getElementById('authForm');

    const authEmail =
        document.getElementById('authEmail');

    const authPassword =
        document.getElementById('authPassword');

    const loginButton =
        document.getElementById('loginButton');

    const registerButton =
        document.getElementById('registerButton');

    const logoutButton =
        document.getElementById('logoutButton');

    const authMessage =
        document.getElementById('authMessage');


    async function updateAuthState() {

        const {
            data: { user },
            error
        } = await supabaseClient.auth.getUser();


        if (error) {

            console.error(
                'AUTH ERROR:',
                error
            );

            return;
        }


        if (user) {

            loginButton.style.display =
                'none';

            registerButton.style.display =
                'none';

            logoutButton.style.display =
                'block';

            authMessage.textContent =
                'وارد حساب شده‌اید: ' +
                user.email;

            authMessage.className =
                'form-message success';

        } else {

            loginButton.style.display =
                'block';

            registerButton.style.display =
                'block';

            logoutButton.style.display =
                'none';

            authMessage.textContent = '';
        }
    }


    // ==========================================
    // Login
    // ==========================================

    if (authForm) {

        authForm.addEventListener(
            'submit',
            async event => {

                event.preventDefault();


                const email =
                    authEmail.value.trim();

                const password =
                    authPassword.value;


                if (!email || !password) {

                    authMessage.textContent =
                        'ایمیل و رمز عبور را وارد کنید.';

                    authMessage.className =
                        'form-message error';

                    return;
                }


                authMessage.textContent =
                    'در حال ورود...';


                const {
                    error
                } =
                    await supabaseClient.auth
                        .signInWithPassword({
                            email,
                            password
                        });


                if (error) {

                    authMessage.textContent =
                        'ورود ناموفق بود: ' +
                        error.message;

                    authMessage.className =
                        'form-message error';

                    return;
                }


                authPassword.value = '';


                await updateAuthState();
            }
        );
    }


    // ==========================================
    // Register
    // ==========================================

    if (registerButton) {

        registerButton.addEventListener(
            'click',
            async () => {

                const email =
                    authEmail.value.trim();

                const password =
                    authPassword.value;


                if (!email || !password) {

                    authMessage.textContent =
                        'ایمیل و رمز عبور را وارد کنید.';

                    authMessage.className =
                        'form-message error';

                    return;
                }


                if (password.length < 6) {

                    authMessage.textContent =
                        'رمز عبور باید حداقل ۶ کاراکتر باشد.';

                    authMessage.className =
                        'form-message error';

                    return;
                }


                authMessage.textContent =
                    'در حال ساخت حساب...';


                const {
                    error
                } =
                    await supabaseClient.auth
                        .signUp({
                            email,
                            password
                        });


                if (error) {

                    authMessage.textContent =
                        'ثبت‌نام ناموفق بود: ' +
                        error.message;

                    authMessage.className =
                        'form-message error';

                    return;
                }


                authMessage.textContent =
                    'حساب ساخته شد. ایمیل خود را بررسی کنید.';

                authMessage.className =
                    'form-message success';
            }
        );
    }


    // ==========================================
    // Logout
    // ==========================================

    if (logoutButton) {

        logoutButton.addEventListener(
            'click',
            async () => {

                const {
                    error
                } =
                    await supabaseClient.auth
                        .signOut();


                if (error) {

                    authMessage.textContent =
                        'خطا در خروج از حساب.';

                    authMessage.className =
                        'form-message error';

                    return;
                }


                await updateAuthState();
            }
        );
    }


    // ==========================================
    // Load Categories
    // ==========================================

    async function loadCategories() {

        categorySelect.innerHTML =
            '<option value="">در حال بارگذاری...</option>';


        const {
            data,
            error
        } =
            await supabaseClient
                .from('categories')
                .select(
                    'id, is_active, sort_order'
                )
                .eq(
                    'is_active',
                    true
                )
                .order(
                    'sort_order'
                );


        if (error) {

            console.error(
                'CATEGORY ERROR:',
                error
            );

            categorySelect.innerHTML =
                '<option value="">خطا</option>';

            return;
        }


        categorySelect.innerHTML =
            '<option value="">انتخاب دسته‌بندی</option>';


        for (const category of data) {

            const {
                data: translation
            } =
                await supabaseClient
                    .from(
                        'category_translations'
                    )
                    .select('name')
                    .eq(
                        'category_id',
                        category.id
                    )
                    .eq(
                        'language_id',
                        '6109220a-404e-43aa-ab72-1e5816687a8f'
                    )
                    .maybeSingle();


            const option =
                document.createElement(
                    'option'
                );


            option.value =
                category.id;


            option.textContent =
                translation?.name ||
                'دسته‌بندی';


            categorySelect.appendChild(
                option
            );
        }
    }


    // ==========================================
    // Load Subcategories
    // ==========================================

    async function loadSubcategories(
        categoryId
    ) {

        subcategorySelect.disabled =
            true;


        if (!categoryId) {

            subcategorySelect.innerHTML =
                '<option value="">ابتدا دسته‌بندی را انتخاب کنید</option>';

            return;
        }


        subcategorySelect.innerHTML =
            '<option value="">در حال بارگذاری...</option>';


        const {
            data,
            error
        } =
            await supabaseClient
                .from('subcategories')
                .select(
                    'id, category_id, is_active, sort_order'
                )
                .eq(
                    'category_id',
                    categoryId
                )
                .eq(
                    'is_active',
                    true
                )
                .order(
                    'sort_order'
                );


        if (error) {

            console.error(
                'SUBCATEGORY ERROR:',
                error
            );

            subcategorySelect.innerHTML =
                '<option value="">خطا</option>';

            return;
        }


        subcategorySelect.innerHTML =
            '<option value="">انتخاب زیردسته</option>';


        for (const subcategory of data) {

            const {
                data: translation
            } =
                await supabaseClient
                    .from(
                        'subcategory_translations'
                    )
                    .select('name')
                    .eq(
                        'subcategory_id',
                        subcategory.id
                    )
                    .eq(
                        'language_id',
                        '6109220a-404e-43aa-ab72-1e5816687a8f'
                    )
                    .maybeSingle();


            const option =
                document.createElement(
                    'option'
                );


            option.value =
                subcategory.id;


            option.textContent =
                translation?.name ||
                'زیردسته';


            subcategorySelect.appendChild(
                option
            );
        }


        subcategorySelect.disabled =
            false;
    }


    // ==========================================
    // Load Provinces
    // ==========================================

    async function loadProvinces() {

        locationSelect.innerHTML =
            '<option value="">در حال بارگذاری...</option>';


        const {
            data: level,
            error: levelError
        } =
            await supabaseClient
                .from(
                    'administrative_levels'
                )
                .select('id')
                .eq(
                    'level_code',
                    'province'
                )
                .maybeSingle();


        if (
            levelError ||
            !level
        ) {

            locationSelect.innerHTML =
                '<option value="">خطا در سطح ولایت</option>';

            return;
        }


        const {
            data,
            error
        } =
            await supabaseClient
                .from(
                    'administrative_units'
                )
                .select(
                    'id, name_native, name_english, code'
                )
                .eq(
                    'level_id',
                    level.id
                )
                .eq(
                    'is_active',
                    true
                )
                .order(
                    'name_english'
                );


        if (error) {

            console.error(
                'PROVINCE ERROR:',
                error
            );

            return;
        }


        locationSelect.innerHTML =
            '<option value="">انتخاب ولایت</option>';


        data.forEach(
            province => {

                const option =
                    document.createElement(
                        'option'
                    );


                option.value =
                    province.id;


                option.textContent =
                    province.name_native ||
                    province.name_english;


                locationSelect.appendChild(
                    option
                );
            }
        );
    }


    // ==========================================
    // Category Event
    // ==========================================

    if (categorySelect) {

        categorySelect.addEventListener(
            'change',
            () => {

                loadSubcategories(
                    categorySelect.value
                );
            }
        );
    }


    // ==========================================
    // Submit Need
    // ==========================================

    if (form) {

        form.addEventListener(
            'submit',
            async event => {

                event.preventDefault();


                showMessage('');


                const title =
                    document.getElementById(
                        'title'
                    ).value.trim();


                const description =
                    document.getElementById(
                        'description'
                    ).value.trim();


                const categoryId =
                    categorySelect.value;


                const subcategoryId =
                    subcategorySelect.value;


                const locationId =
                    locationSelect.value;


                const contactPhone =
                    contactPhoneInput.value.trim();


                // ==================================
                // Validation
                // ==================================

                if (!title) {

                    showMessage(
                        'عنوان نیاز را وارد کنید.',
                        'error'
                    );

                    return;
                }


                if (!categoryId) {

                    showMessage(
                        'دسته‌بندی را انتخاب کنید.',
                        'error'
                    );

                    return;
                }


                if (!subcategoryId) {

                    showMessage(
                        'زیردسته را انتخاب کنید.',
                        'error'
                    );

                    return;
                }


                if (!locationId) {

                    showMessage(
                        'ولایت را انتخاب کنید.',
                        'error'
                    );

                    return;
                }


                if (!contactPhone) {

                    showMessage(
                        'شماره تلفن خود را وارد کنید.',
                        'error'
                    );

                    return;
                }


                // ==================================
                // Normalize Phone
                // ==================================

                const normalizedPhone =
                    contactPhone
                        .replace(/\s+/g, '')
                        .replace(/-/g, '');


                const phoneRegex =
                    /^(07\d{8}|\+937\d{8})$/;


                if (
                    !phoneRegex.test(
                        normalizedPhone
                    )
                ) {

                    showMessage(
                        'شماره تلفن معتبر افغانستان وارد کنید. مثال: 0700000000',
                        'error'
                    );

                    return;
                }


                // ==================================
                // Current User
                // ==================================

                const {
                    data: userData,
                    error: userError
                } =
                    await supabaseClient.auth
                        .getUser();


                if (
                    userError ||
                    !userData.user
                ) {

                    showMessage(
                        'لطفاً ابتدا وارد حساب کاربری شوید.',
                        'error'
                    );

                    return;
                }


                // ==================================
                // Button
                // ==================================

                const submitButton =
                    form.querySelector(
                        'button[type="submit"]'
                    );


                submitButton.disabled =
                    true;

                submitButton.textContent =
                    'در حال ثبت...';


                try {

                    // ==================================
                    // RPC
                    // ==================================

                    const {
                        data,
                        error
                    } =
                        await supabaseClient.rpc(
                            'create_need',
                            {
                                p_user_id:
                                    userData.user.id,

                                p_title:
                                    title,

                                p_description:
                                    description ||
                                    null,

                                p_category_id:
                                    categoryId,

                                p_subcategory_id:
                                    subcategoryId,

                                p_location_id:
                                    locationId,

                                p_status:
                                    'active',

                                p_contact_phone:
                                    normalizedPhone
                            }
                        );


                    if (error) {

                        console.error(
                            'CREATE NEED ERROR:',
                            error
                        );


                        showMessage(
                            'خطا در ثبت نیاز: ' +
                            error.message,
                            'error'
                        );

                        return;
                    }


                    console.log(
                        'CREATED NEED:',
                        data
                    );


                    // ==================================
                    // Success
                    // ==================================

                    showMessage(
                        'نیاز شما با موفقیت ثبت شد.',
                        'success'
                    );


                    form.reset();


                    subcategorySelect.innerHTML =
                        '<option value="">ابتدا دسته‌بندی را انتخاب کنید</option>';


                    subcategorySelect.disabled =
                        true;


                } catch (error) {

                    console.error(
                        'UNEXPECTED ERROR:',
                        error
                    );


                    showMessage(
                        'خطای غیرمنتظره هنگام ثبت نیاز.',
                        'error'
                    );


                } finally {

                    submitButton.disabled =
                        false;

                    submitButton.textContent =
                        'ثبت نیاز';
                }
            }
        );
    }


    // ==========================================
    // Start
    // ==========================================

    await updateAuthState();

    await Promise.all([
        loadCategories(),
        loadProvinces()
    ]);

});
