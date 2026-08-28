
document.addEventListener('DOMContentLoaded', async () => {
    const { data, error } = await supabaseClient
        .from('needs_list')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

    if (error) {
        console.error('Supabase error:', error);
        document.body.insertAdjacentHTML(
            'beforeend',
            `<p style="color:red;text-align:center;">
                خطا در اتصال به دیتابیس: ${error.message}
            </p>`
        );
        return;
    }

    console.log('Supabase connected successfully');
    console.log('Needs:', data);

    document.body.insertAdjacentHTML(
        'beforeend',
        `<p style="color:green;text-align:center;">
            اتصال به دیتابیس موفق بود — ${data.length} درخواست پیدا شد.
        </p>`
    );
});
