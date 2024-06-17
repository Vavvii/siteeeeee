document.addEventListener('DOMContentLoaded', () => {
    const adminPanel = document.getElementById('admin-content');

    document.getElementById('add-info').addEventListener('click', () => {
        adminPanel.innerHTML = '';
        adminPanel.innerHTML = `
            <h2>Добавить товар</h2>
            <form id="add-product-form">
                <div>
                    <label for="product-name">Название товара:</label>
                    <input type="text" id="product-name" name="product-name" required>
                </div>
                <div>
                    <label for="product-description">Описание товара:</label>
                    <textarea id="product-description" name="product-description" required></textarea>
                </div>
                <div>
                    <label for="product-price">Цена товара:</label>
                    <input type="number" id="product-price" name="product-price" required>
                </div>
                <div>
                    <label for="product-image">Картинка товара:</label>
                    <input type="text" id="product-image" name="product-image" required>
                </div>
                <button type="submit">Добавить</button>
            </form>
        `;

        const addProductForm = document.getElementById('add-product-form');
        addProductForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = {
                name: addProductForm['product-name'].value,
                description: addProductForm['product-description'].value,
                price: addProductForm['product-price'].value,
                image: addProductForm['product-image'].value,
            };

            try {
                const response = await fetch('/addProduct', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                const result = await response.json();
                if (result.success) {
                    alert('Товар успешно добавлен!');
                    addProductForm.reset();
                } else {
                    alert('Произошла ошибка при добавлении товара.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Произошла ошибка при отправке запроса на сервер.');
            }
        });
    });



    document.getElementById('edit-info').addEventListener('click', async () => {
        adminPanel.innerHTML = '';
        adminPanel.innerHTML = '<h2>Редактировать товар</h2><div id="product-list"></div>';

        try {
            const response = await fetch('/getProducts');
            const products = await response.json();

            if (products.length > 0) {
                const productList = document.getElementById('product-list');
                products.forEach(product => {
                    const productItem = document.createElement('div');
                    productItem.classList.add('product-item');
                    productItem.innerHTML = `
                        <p>Название: ${product.name}</p>
                        <p>Описание: ${product.description}</p>
                        <p>Цена: ${product.price}</p>
                        <p>Картинка: <img src="${product.image}" alt="${product.name}" width="100"></p>
                        <button class="edit-button" data-id="${product.id}">Редактировать</button>
                    `;
                    productList.appendChild(productItem);
                });

                document.querySelectorAll('.edit-button').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const productId = e.target.getAttribute('data-id');
                        const product = products.find(p => p.id === parseInt(productId));

                        adminPanel.innerHTML = `
                            <h2>Редактировать товар</h2>
                            <form id="edit-product-form">
                                <input type="hidden" id="product-id" name="product-id" value="${product.id}">
                                <div>
                                    <label for="product-name">Название товара:</label>
                                    <input type="text" id="product-name" name="product-name" value="${product.name}" required>
                                </div>
                                <div>
                                    <label for="product-description">Описание товара:</label>
                                    <textarea id="product-description" name="product-description" required>${product.description}</textarea>
                                </div>
                                <div>
                                    <label for="product-price">Цена товара:</label>
                                    <input type="number" id="product-price" name="product-price" value="${product.price}" required>
                                </div>
                                <div>
                                    <label for="product-image">Картинка товара:</label>
                                    <input type="text" id="product-image" name="product-image" value="${product.image}" required>
                                </div>
                                <button type="submit">Сохранить</button>
                            </form>
                        `;

                        const editProductForm = document.getElementById('edit-product-form');
                        editProductForm.addEventListener('submit', async (e) => {
                            e.preventDefault();

                            const formData = {
                                id: editProductForm['product-id'].value,
                                name: editProductForm['product-name'].value,
                                description: editProductForm['product-description'].value,
                                price: editProductForm['product-price'].value,
                                image: editProductForm['product-image'].value,
                            };

                            try {
                                const response = await fetch(`/editProduct/${formData.id}`, {
                                    method: 'PUT',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify(formData),
                                });

                                const result = await response.json();
                                if (result.success) {
                                    alert('Товар успешно отредактирован!');
                                    document.getElementById('edit-info').click();
                                } else {
                                    alert('Произошла ошибка при редактировании товара.');
                                }
                            } catch (error) {
                                console.error('Error:', error);
                                alert('Произошла ошибка при отправке запроса на сервер.');
                            }
                        });
                    });
                });
            } else {
                adminPanel.innerHTML += '<p>Нет товаров для редактирования.</p>';
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Произошла ошибка при загрузке товаров.');
        }
    });

    document.getElementById('delete-info').addEventListener('click', async () => {
        adminPanel.innerHTML = '';
        adminPanel.innerHTML = '<h2>Удалить товар</h2><div id="product-list"></div>';

        try {
            const response = await fetch('/getProducts');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const products = await response.json();

            if (products.length > 0) {
                const productList = document.getElementById('product-list');
                products.forEach(product => {
                    const productItem = document.createElement('div');
                    productItem.classList.add('product-item');
                    productItem.innerHTML = `
                        <input type="checkbox" class="delete-checkbox" data-id="${product.id}">
                        <p>Название: ${product.name}</p>
                        <p>Описание: ${product.description}</p>
                        <p>Цена: ${product.price}</p>
                        <p>Картинка: <img src="${product.image}" alt="${product.name}" width="100"></p>
                    `;
                    productList.appendChild(productItem);
                });

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Удалить выбранные товары';
                deleteButton.addEventListener('click', async () => {
                    const checkedBoxes = document.querySelectorAll('.delete-checkbox:checked');
                    const idsToDelete = Array.from(checkedBoxes).map(checkbox => checkbox.getAttribute('data-id'));

                    try {
                        const response = await fetch('/deleteProducts', {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ ids: idsToDelete }),
                        });

                        const result = await response.json();
                        if (result.success) {
                            alert('Товары успешно удалены!');
                            document.getElementById('delete-info').click();
                        } else {
                            alert('Произошла ошибка при удалении товаров.');
                        }
                    } catch (error) {
                        console.error('Error:', error);
                        alert('Произошла ошибка при отправке запроса на сервер.');
                    }
                });

                adminPanel.appendChild(deleteButton);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
    document.getElementById('view-feedback').addEventListener('click', async () => {
        try {
            const response = await fetch('/feedback_admin');
            const feedbackData = await response.json();

            if (!response.ok) {
                throw new Error('Ошибка получения данных обратной связи');
            }

            
            adminPanel.innerHTML = '';

            
            const feedbackHTML = `
                <h2>Обратная связь</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Имя</th>
                            <th>Email</th>
                            <th>Сообщение</th>
                            <th>Дата</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${feedbackData.map(feedback => `
                            <tr>
                                <td>${feedback.name}</td>
                                <td>${feedback.email}</td>
                                <td>${feedback.message}</td>
                                <td>${new Date(feedback.created_at).toLocaleString()}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;

            
            adminPanel.innerHTML = feedbackHTML;
        } catch (error) {
            console.error('Ошибка:', error);
            
            adminPanel.innerHTML = '<p>Произошла ошибка при загрузке данных обратной связи.</p>';
        }
    });
    document.getElementById('view-orders').addEventListener('click', async () => {
        try {
            const response = await fetch('/orders');
            const orders = await response.json();

            if (!response.ok) {
                throw new Error('Ошибка получения данных заказов');
            }

            
            adminPanel.innerHTML = '';

            
            const ordersHTML = `
                <h2>Все заказы</h2>
                <table>
                    <thead>
                        <tr>
                            <th>ID Заказа</th>
                            <th>Пользователь</th>
                            <th>Сумма</th>
                            <th>Статус</th>
                            <th>Адрес</th>
                            <th>Телефон</th>
                            <th>Дата</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${orders.map(order => `
                            <tr>
                                <td>${order.id}</td>
                                <td>${order.username}</td>
                                <td>${order.total}</td>
                                <td>${order.status}</td>
                                <td>${order.address}</td>
                                <td>${order.phone}</td>
                                <td>${new Date(order.created_at).toLocaleString()}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;

         
            adminPanel.innerHTML = ordersHTML;
        } catch (error) {
            console.error('Ошибка:', error);
            
            adminPanel.innerHTML = '<p>Произошла ошибка при загрузке данных заказов.</p>';
        }
    });
});

