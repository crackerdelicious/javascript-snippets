class Cart {
    key = '_cart'; // กำหนด คีย์ ให้กับ เบราเซอร์เซสชั่น
    cart; // กำหนด ตัวแปลสำหรับตะกร้า

    /**
     * จริงๆ จะใส่ Window.localStorage ก็ได้ แล้วแต่สถานการณ์
     * 
     * @param {Window.sessionStorage} session
     */
    constructor(session) {
        // กำหนด session ให้กับ property
        this.session = session;

        // ให้ cart_list นี้ เป็น ตัวเก็บรายการในตะกร้า ประมาณว่าเป็นคอนเทนเนอร์ <ul id="cart_list"></ul>
        this.cart_list = document.getElementById('cart_list');

        // แสดงรายการตะกร้าสินค้าปัจจุบัน
        this.display();

        // ใส่หูให้ปุ่ม Dismiss ในรายการตะกร้าสินค้าปัจจุบัน
        this.remove();
    }

    /**
     * ไปเอาคีย์ ของตะกร้า ปัจจุบัน
     * 
     * @returns คีย์ "_cart" ปัจจุบัน
     */
    get() {
        return this.session.getItem(this.key);
    }

    /**
     * ดาต้าเซ็ต ที่เก็บไว้ใน ปุ่ม add to cart 
     * เช่น data-id data-name
     * ตอนใช้ให้ Loop ผ่าน querySelectorAll แล้วใช้ 'click' Listerner
     * จากนั้น ให้ใส e.target.dataset เข้าไป ตามตัวอย่างด้านล่าง
     *      
     * @param {*} product 
     */

    add(product) {
        // กำหนด property cart โดยเช็คก่อนว่า มีคีย์ ใน session หรือยัง
        // ถ้ายัง ใส้เป็น อาร์เรย์ เปล่าไปก่อน
        this.cart = (this.get()) ? JSON.parse(this.get()) : [];

        // ไม่ว่าจะมีสินค้าในตะกร้าหรือไม่ เมธอดนี้มีหน้าที่แค่ เพิ่มรายการเข้าไป
        this.cart.push({
            entry: +new Date().valueOf(), // ใช้ Timestamp เป็น คีย์ สำหรับแต่ละรายการ
            id: product['id'],
            name: product['name'],
            price: product['price'],
            image: product['image'],
            quantity: product['quantity'],
        });

        // เพิ่มแล้วก็เซฟเซสชั่นซะ
        this.save(this.cart);
        // จากนั้นจึงแสดงผล รายการตะกร้า
        this.display();
        // อย่าลืมใส่เมธอดนี้ ไม่งั้น ปุ่ม dismiss จะไม่มีหูได้ยิน
        this.remove();
    }

    /**
     * เมธอดนี้ทำหน้าที่แสดงรายการสินค้าในตะกร้า ถ้าหากว่ามี
     * ถ้าไม่มี ก็แสดงว่า ไม่มีสินค้าในตะกร้า
     */
    display() {
        let item = '';

        // ดึง คีย์ ปัจจุบัน จากนั้นจึงเช็คว่ามี คีย์ หรือไม่ ถ้าไม่มี ก็แสดงตะกร้าเปล่า
        this.cart = JSON.parse(this.get());
        if (this.get()) {
            // Loop ผ่าน รายการใน คีย์ _cart แล้วเอามาใส่ HTML
            this.cart.forEach(each => {
                item += `<li class="list-group-item">
                <div class="row">
                    <div class="col-3">
                        <img src="${each['image']}" class="img-thumbnail">
                    </div>
                    <div class="col-9">
                        <p id="${each['id']}">
                            <span>${each['name']}</span>
                            <span class="float-end">${each['price']}</span>
                        </p>
                        <span class="remove-from-cart badge rounded-pill bg-danger" style="cursor: pointer;"
                        data-entry="${each['entry']}">ลบสินค้า</span>
                    </div>
                </div>
            </li>`;
            });
        } else {
            // ไม่พบคีย์ _cart ก็ใส่ตะกร้าเปล่าไป
            item += '<li class="list-group-item">Your cart is empty.</li>';
        }

        // ยัดรายการสินค้า ใส่ตะกร้า
        this.cart_list.innerHTML = item;
    }

    remove() {
        // ทุกครั้ง ที่เรียกใช้เมธอดนี้ จำเป็นต้อง เขียนทับใหม่ property cart ทุกครั้ง 
        // เพราะรายการในตะกร้า จะต้องเป็นปัจจุบัน จาก Session เสมอ มิเช่นนั้น 
        // property นี้ จะเป็นรายการตัวล่าสุด จาก method ล่าสุด
        this.cart = JSON.parse(this.get());
        // เรียกปุ่ม dismiss มาใส่ หู ให้ฟังเสียง click ทุกตัว
        // css class สำหรับปุ่มลบ นี้จะเป็นอะไรก็ได้ แต่ต้องเหมือนกันกับตอน display()
        document.querySelectorAll('.remove-from-cart').forEach(each => {
            each.addEventListener('click', e => {
                // เมื่อได้ยินคลิกแล้ว จากนั้นจึงเริ่มลบสินค้า
                // โดยการ Loop ผ่านรายการสินค้าแต่ละรายการในตะกร้า
                // เราจะใช้ พารามิเตอร์ 2 ตัว each อ้างถึง ออปเจ็ค แต่ละตัว
                // index อ้างถึงดัชนี้ ของ ออปเจ็คนั้นๆ
                this.cart.forEach((each, index) => {
                    // - ขั้นตอนแรก
                    //   เช็คก่อนว่า entry ที่เราใช้ Timestamp ตรงกันกับ entry 
                    //   ที่เราใส่ไว้ในปุ่ม dismiss ในแอททริบิวต์ data-entry หรือไม่
                    if (each['entry'] == e.target.dataset.entry) {
                        // จากนั้นจึงลบ รายการ ในตะกร้าของเราตาม ดัชนีนั้น
                        this.cart.splice(index, 1);
                        // ดังนั้นจึงเซฟ
                        this.save(this.cart);
                    }
                });
                // แล้ว ค่อยลบ element ในหน้า client ออก
                e.target.offsetParent.remove();
                // ถ้าไม่มี สินค้าในตะกร้าแล้ว ก็ลบ คีย์ทิ้งไปเลย แล้วค่อยเปลี่ยนเป็น ตะกร้าเปล่า
                if (this.cart.length < 1) {
                    this.cart_list.innerHTML = '<li class="list-group-item">Your cart is empty.</li>';
                    this.clear();
                }
            });
        });
    }

    /**
     * ทำการเซฟ รายการตะกร้าที่เราเพิ่มแล้ว เข้าสู่ session
     * 
     * @param {object} new_cart ตะกร้าใหม่ ที่อัพเดทแล้วล่าสุด
     */
    save(new_cart) {
        this.session.setItem(this.key, JSON.stringify(new_cart));
    }

    /**
     * ลบ คีย์ ออกจาก เซสชั่น
     */
    clear() {
        this.session.removeItem(this.key);
    }
}

// ตัวอย่างการนำไปใช้งาน
(() => {
    const cart = new Cart(sessionStorage);

    document.querySelectorAll('.cart__add').forEach(each => {
        each.addEventListener('click', e => {
            e.preventDefault();
            cart.add(e.target.dataset);
        });
    });
})();
