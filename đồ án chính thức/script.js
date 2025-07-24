// Core authentication logic by Ho Nguyen Duc Huy
document.addEventListener('DOMContentLoaded', function() {
    // Xử lý giỏ hàng
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const cartList = document.querySelector('.cart-items');
    const totalPriceEl = document.querySelector('.total-price span');
    const checkoutBtn = document.querySelector('.checkout-btn');
    const cartContainer = document.querySelector('.cart-container');

    function updateCart() {
        if (!cartList || !totalPriceEl) return;

        cartList.innerHTML = '';
        let total = 0;
        cartItems.forEach((item, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                ${item.name} - ${item.price.toLocaleString()}₫
                <button class="remove-item" data-index="${index}">Xóa</button>
            `;
            cartList.appendChild(li);
            total += item.price;
        });
        totalPriceEl.textContent = `${total.toLocaleString()}₫`;
        localStorage.setItem('cartItems', JSON.stringify(cartItems));

        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.dataset.index);
                cartItems.splice(index, 1);
                updateCart();
                alert('Đã xóa sản phẩm khỏi giỏ hàng!');
            });
        });
    }

    // Thêm sản phẩm vào giỏ
    document.querySelectorAll('.btn-detail').forEach(btn => {
        btn.addEventListener('click', () => {
            const name = btn.dataset.name;
            const price = parseInt(btn.dataset.price);
            if (name && !isNaN(price)) {
                cartItems.push({ name, price });
                updateCart();
                alert('Đã thêm vào giỏ hàng!');
            }
        });
    });

    // Xử lý nút thanh toán
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cartItems.length === 0) {
                alert('Giỏ hàng của bạn đang trống!');
                return;
            }
            window.location.href = 'checkout.html';
        });
    }

    // Xử lý giỏ hàng mobile
    if (cartContainer) {
        cartContainer.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                if (!this.classList.contains('expanded')) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.classList.add('expanded');
                }
            }
        });
        
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 768 && 
                cartContainer.classList.contains('expanded') &&
                !cartContainer.contains(e.target)) {
                cartContainer.classList.remove('expanded');
            }
        });
    }

    updateCart();

    // Xử lý form đăng ký
    const registerForm = document.querySelector('#register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();
            const confirmPassword = document.getElementById('confirm-password').value.trim();

            if (!name || !email || !password || !confirmPassword) {
                alert('Vui lòng điền đầy đủ thông tin!');
                return;
            }

            if (password !== confirmPassword) {
                alert('Mật khẩu xác nhận không khớp!');
                return;
            }

            let users = JSON.parse(localStorage.getItem('users')) || [];
            if (users.some(user => user.email === email)) {
                alert('Email đã được đăng ký!');
                return;
            }

            users.push({ name, email, password });
            localStorage.setItem('users', JSON.stringify(users));
            alert('Đăng ký thành công! Vui lòng đăng nhập.');
            window.location.href = 'login.html';
        });
    }

    // Xử lý form đăng nhập
    const loginForm = document.querySelector('#login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();

            if (!email || !password) {
                alert('Vui lòng điền đầy đủ thông tin!');
                return;
            }

            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(user => user.email === email && user.password === password);

            if (!user) {
                alert('Email hoặc mật khẩu không đúng!');
                return;
            }

            alert('Đăng nhập thành công!');
            window.location.href = 'index.html';
        });
    }

    // Xử lý form thanh toán
    const checkoutForm = document.querySelector('#checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();

            if (cartItems.length === 0) {
                alert('Giỏ hàng trống, vui lòng thêm sản phẩm!');
                return;
            }

            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const address = document.getElementById('address').value.trim();

            if (!name || !phone || !address) {
                alert('Vui lòng điền đầy đủ thông tin!');
                return;
            }

            alert(`Đơn hàng của ${name} đã được đặt thành công!\nSố điện thoại: ${phone}\nĐịa chỉ: ${address}`);
            localStorage.removeItem('cartItems');
            checkoutForm.reset();
            window.location.href = 'index.html';
        });
    }
});
