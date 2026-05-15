// check-auth.js - التحقق من مصادقة المستخدم مع رمز الدخول السري

const SECRET_ACCESS_CODE = 'wjiewije9wu9349skfldli';

// قائمة صفحات الأدمن التي تتطلب رمز الوصول
const adminPages = [
    'admin-championship.html',
    'admin-deposit.html',
    'admin-withdraw.html',
    'admin.problem.html',
    'admin.puplic.html',
    'admin.support.html',
    'admin.money.html',
    'admin-chat.html',
    'inf.html',
];

function isAdminPage(pageName) {
    return adminPages.includes(pageName);
}

function checkAuth() {
    const currentUser = localStorage.getItem('currentUser');
    const currentPage = window.location.pathname.split('/').pop();

    // التحقق من وجود رمز الدخول السري في URL فقط (وليس في localStorage للتخزين الدائم)
    const urlParams = new URLSearchParams(window.location.search);
    const accessCode = urlParams.get('access');

    // جلسة الأدمن المؤقتة (تختفي عند إغلاق المتصفح)
    const adminSession = sessionStorage.getItem('admin_session');

    // الصفحات المسموح بها بدون تسجيل دخول
    const publicPages = ['start.html', 'signup.html', 'signin.html', 'check-auth.js', 'index.html', ''];

    // إذا كانت الصفحة الحالية من الصفحات العامة، لا نتحقق
    if (publicPages.includes(currentPage)) {
        return true;
    }

    // التحقق من رمز الدخول السري لصفحات الأدمن
    if (isAdminPage(currentPage)) {
        // التحقق من وجود جلسة أدمن نشطة OR رمز في URL
        if (adminSession === SECRET_ACCESS_CODE || accessCode === SECRET_ACCESS_CODE) {
            // حفظ الجلسة في sessionStorage فقط (تختفي عند إغلاق المتصفح)
            sessionStorage.setItem('admin_session', SECRET_ACCESS_CODE);
            return true;
        } else {
            // إظهار نافذة إدخال الرمز
            document.body.innerHTML = '';
            document.body.style.backgroundColor = '#000000';
            document.body.style.color = '#FFD700';
            document.body.style.fontFamily = 'Arial, sans-serif';
            document.body.style.minHeight = '100vh';
            document.body.style.display = 'flex';
            document.body.style.justifyContent = 'center';
            document.body.style.alignItems = 'center';

            document.body.innerHTML = `
                <div style="text-align: center; padding: 30px; max-width: 400px; background-color: #0a0a0a; border: 1px solid #FFD700; border-radius: 20px;">
                    <div style="font-size: 3rem; margin-bottom: 20px;">🔑</div>
                    <h2 style="color: #FFD700; margin-bottom: 15px;">الوصول المقيد</h2>
                    <p style="color: #CCCCCC; margin-bottom: 25px;">هذه الصفحة مخصصة للإدمن فقط. أدخل رمز الوصول:</p>
                    <input type="password" id="accessInput" style="width: 100%; padding: 12px; background-color: #1a1a1a; border: 1px solid #FFD700; border-radius: 8px; color: #FFD700; font-size: 1rem; margin-bottom: 15px; text-align: center;" placeholder="أدخل رمز الوصول" autofocus>
                    <button id="accessBtn" style="width: 100%; background-color: #FFD700; color: #000000; border: none; padding: 12px; font-size: 1rem; font-weight: bold; cursor: pointer; border-radius: 8px;">تأكيد</button>
                </div>
            `;

            document.getElementById('accessBtn').addEventListener('click', () => {
                const inputCode = document.getElementById('accessInput').value;
                if (inputCode === SECRET_ACCESS_CODE) {
                    sessionStorage.setItem('admin_session', SECRET_ACCESS_CODE);
                    window.location.reload();
                } else {
                    alert('رمز الوصول غير صحيح');
                    document.getElementById('accessInput').value = '';
                    document.getElementById('accessInput').focus();
                }
            });

            document.getElementById('accessInput').addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    document.getElementById('accessBtn').click();
                }
            });

            return false;
        }
    }

    // إذا لم يكن هناك مستخدم مسجل دخول للصفحات العادية
    if (!currentUser) {
        document.body.innerHTML = '';
        document.body.style.backgroundColor = '#000000';
        document.body.style.color = '#FFD700';
        document.body.style.fontFamily = 'Arial, sans-serif';
        document.body.style.minHeight = '100vh';
        document.body.style.display = 'flex';
        document.body.style.justifyContent = 'center';
        document.body.style.alignItems = 'center';

        document.body.innerHTML = `
            <div style="text-align: center; padding: 20px; max-width: 400px;">
                <div style="font-size: 5rem; margin-bottom: 20px;">🔒</div>
                <h1 style="color: #FFD700; font-size: 2rem; margin-bottom: 15px;">غير مصرح بالدخول</h1>
                <p style="color: #CCCCCC; margin-bottom: 30px;">يجب عليك تسجيل الدخول أو إنشاء حساب جديد للوصول إلى هذه الصفحة</p>
                <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                    <a href="signup.html" style="background-color: #000000; color: #FFFFFF; border: 2px solid #FFFFFF; padding: 12px 30px; font-size: 1rem; font-weight: bold; cursor: pointer; border-radius: 5px; text-decoration: none; display: inline-block;">تسجيل</a>
                    <a href="signin.html" style="background-color: #FFD700; color: #000000; border: 2px solid #FFD700; padding: 12px 30px; font-size: 1rem; font-weight: bold; cursor: pointer; border-radius: 5px; text-decoration: none; display: inline-block;">دخول</a>
                </div>
                <div style="margin-top: 30px;">
                    <a href="start.html" style="color: #FFD700; text-decoration: none;">← العودة إلى الصفحة الرئيسية</a>
                </div>
            </div>
        `;
        return false;
    }

    return true;
}

// تنفيذ التحقق عند تحميل الصفحة
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkAuth);
} else {
    checkAuth();
}