document.addEventListener('DOMContentLoaded', async () => {

    // ==============================
    // Need Form Elements
    // ==============================

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


    // ==============================
    // Authentication Elements
    // ==============================

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


    // ==============================
    // Message
    // ==============================

    function showMessage(text, type = '') {

        if (!message) return;

        message.textContent = text;

        message.className =
            'form-message ' + type;
    }


    // ==============================
    // Authentication State
    // ==============================

    async function updateAuthState() {

        const {
            data: { user },
            error
        } = await supabaseClient.auth.getUser();


        if (error) {

            console.error(
                'AUTH STATE ERROR:',
                error
            );

            return;
        }


        if (user) {

            if (loginButton)
                loginButton.style.display = 'none';

            if (registerButton)
                registerButton.style.display = 'none';

            if (logoutButton)
                logoutButton.style.display = 'block';


            if (authMessage) {

                authMessage.textContent =
                    'وارد حساب شده‌اید: ' +
                    user.email;

                authMessage.className =
                    'form-message success';
            }

        } else {

            if (loginButton)
                loginButton.style.display = 'block';

            if (registerButton)
                registerButton.style.display = 'block';

            if (logoutButton)
                logoutButton.style.display = 'none';


            if (authMessage) {

                authMessage.textContent = '';

                authMessage.className =
                    'form-message';
            }
        }
    }


    // ==============================
    // Login
    // ==============================

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

                    console.error(
                        'LOGIN ERROR:',
                        error
                    );

                    authMessage.textContent =
                        'ورود ناموفق بود: ' +
                        error.message;

                    authMessage.className =
                        'form-message error';

                    return;
                }


                authMessage.textContent =
                    'با موفقیت وارد شدید.';

                authMessage.className =
                    'form-message success';


                authPassword.value = '';


                await updateAuthState();
            }
        );
    }


    // ==============================
    // Register
    // ==============================

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
                    data,
                    error
                } =
                    await supabaseClient.auth
                        .signUp({
                            email,
                            password
                        });


                if (error) {

                    console.error(
                        'REGISTER ERROR:',
                        error
                    );

                    authMessage.textContent =
                        'ثبت‌نام ناموفق بود: ' +
                        error.message;

                    authMessage.className =
                        'form-message error';

                    return;
                }


                console.log(
                    'REGISTERED USER:',
                    data?.user
                );


                authMessage.textContent =
                    'حساب ساخته شد. ایمیل خود را برای تأیید بررسی کنید.';

                authMessage.className =
                    'form-message success';
            }
        );
    }


    // ==============================
    // Logout
    // ==============================

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

                    console.error(
                        'LOGOUT ERROR:',
                        error
                    );

                    authMessage.textContent =
                        'خطا در خروج از حساب.';

                    authMessage.className =
                        'form-message error';

                    return;
                }


                authMessage.textContent =
                    'از حساب خارج شدید.';

                authMessage.className =
                    'form-message success';


                await updateAuthState();
            }
        );
    }


    // ==============================
    // Load Categories
    // ==============================

    async function loadCategories() {

        if (!categorySelect) return;


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
                '<option value="">خطا در بارگذاری دسته‌بندی</option>';


            showMessage(
                'خطا در بارگذاری دسته‌بندی: ' +
                error.message,
                'error'
            );


            return;
        }


        categorySelect.innerHTML =
            '<option value="">انتخاب دسته‌بندی</option>';


        for (const category of data) {

            const {
                data: translation,
                error: translationError
            } =
                await supabaseClient
                    .from('category_translations')
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


            if (translationError) {

                console.error(
                    'CATEGORY TRANSLATION ERROR:',
                    translationError
                );
            }


            const option =
                document.createElement('option');


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


    // ==============================
    // Load Subcategories
    // ==============================

    async function loadSubcategories(
        categoryId
    ) {

        if (!subcategorySelect)
            return;


        subcategorySelect.innerHTML =
            '<option value="">در حال بارگذاری...</option>';


        subcategorySelect.disabled =
            true;


        if (!categoryId) {

            subcategorySelect.innerHTML =
                '<option value="">ابتدا دسته‌بندی را انتخاب کنید</option>';

            return;
        }


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
                '<option value="">خطا در بارگذاری زیردسته</option>';


            return;
        }


        subcategorySelect.innerHTML =
            '<option value="">انتخاب زیردسته</option>';


        for (const subcategory of data) {

            const {
                data: translation,
                error: translationError
            } =
                await supabaseClient
                    .from('subcategory_translations')
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


            if (translationError) {

                console.error(
                    'SUBCATEGORY TRANSLATION ERROR:',
                    translationError
                );
            }


            const option =
                document.createElement('option');


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


    // ==============================
    // Load Provinces
    // ==============================

    async function loadProvinces() {

        if (!locationSelect)
            return;


        locationSelect.innerHTML =
            '<option value="">در حال بارگذاری...</option>';


        const {
            data: level,
            error: levelError
        } =
            await supabaseClient
                .from('administrative_levels')
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

            console.error(
                'LEVEL ERROR:',
                levelError
            );


            locationSelect.innerHTML =
                '<option value="">خطا در سطح ولایت</option>';


            return;
        }


        const {
            data,
            error
        } =
            await supabaseClient
                .from('administrative_units')
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


            locationSelect.innerHTML =
                '<option value="">خطا در بارگذاری ولایت‌ها</option>';


            showMessage(
                'خطا در بارگذاری ولایت‌ها: ' +
                error.message,
                'error'
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


    // ==============================
    // Category Change
    // ==============================

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


    // ==============================
    // Submit Need
    // ==============================

    if (form) {

        form.addEventListener(
            'submit',
            async event => {

                event.preventDefault();


                showMessage('');


                // ==============================
                // Get Values
                // ==============================

                const title =
                    document.getElementById(
                        'title'
                    )?.value.trim();


                const description =
                    document.getElementById(
                        'description'
                    )?.value.trim();


                const categoryId =
                    categorySelect?.value;


                const subcategoryId =
                    subcategorySelect?.value;


                const locationId =
                    locationSelect?.value;


                const contactPhone =
                    contactPhoneInput
                        ?.value
                        .trim();


                // ==============================
                // Validate Title
                // ==============================

                if (!title) {

                    showMessage(
                        'عنوان نیاز را وارد کنید.',
                        'error'
                    );

                    return;
                }


                // ==============================
                // Validate Category
                // ==============================

                if (!categoryId) {

                    showMessage(
                        'دسته‌بندی را انتخاب کنید.',
                        'error'
                    );

                    return;
                }


                // ==============================
                // Validate Subcategory
                // ==============================

                if (!subcategoryId) {

                    showMessage(
                        'زیردسته را انتخاب کنید.',
                        'error'
                    );

                    return;
                }


                // ==============================
                // Validate Location
                // ==============================

                if (!locationId) {

                    showMessage(
                        'ولایت را انتخاب کنید.',
                        'error'
                    );

                    return;
                }


                // ==============================
                // Validate Phone
                // ==============================

                if (!contactPhone) {

                    showMessage(
                        'شماره تلفن خود را وارد کنید.',
                        'error'
                    );

                    return;
                }


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


                // ==============================
                // Get Current User
                // ==============================

                const {
                    data: userData,
                    error: userError
                } =
                    await supabaseClient.auth.getUser();


                if (
                    userError ||
                    !userData ||
                    !userData.user
                ) {

                    showMessage(
                        'لطفاً ابتدا وارد حساب کاربری شوید.',
                        'error'
                    );

                    return;
                }


                // ==============================
                // Submit Button
                // ==============================

                const submitButton =
                    form.querySelector(
                        'button[type="submit"]'
                    );


                if (submitButton) {

                    submitButton.disabled =
                        true;

                    submitButton.textContent =
                        'در حال ثبت...';
                }


                showMessage(
                    'در حال ثبت نیاز...'
                );


                try {

                    // ==============================
                    // Create Need
                    // ==============================

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
                        'NEED CREATED:',
                        data
                    );


                    // ==============================
                    // Success
                    // ==============================

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

                    if (submitButton) {

                        submitButton.disabled =
                            false;

                        submitButton.textContent =
                            'ثبت نیاز';
                    }
                }

            }
        );
    }


    // ==============================
    // Start Application
    // ==============================

    await updateAuthState();


    await Promise.all([
        loadCategories(),
        loadProvinces()
    ]);

});
