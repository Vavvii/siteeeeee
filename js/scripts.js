document.addEventListener('DOMContentLoaded', () => {
    const infoSection = document.getElementById('info-section');
    const hideInfoBtn = document.getElementById('hide-info-btn');
    const filterInput = document.getElementById('filter');
    const showAllBtn = document.getElementById('show-all-btn');
    const productCards = document.querySelectorAll('.product-card');

    
    if (hideInfoBtn) {
        hideInfoBtn.addEventListener('click', () => {
            infoSection.style.display = 'none';
        });
    }

    if (filterInput) {
        filterInput.addEventListener('input', () => {
            const filterValue = filterInput.value.toLowerCase();
            productCards.forEach(card => {
                const productName = card.querySelector('h3').textContent.toLowerCase();
                if (productName.includes(filterValue)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    if (showAllBtn) {
        showAllBtn.addEventListener('click', () => {
            filterInput.value = '';
            productCards.forEach(card => {
                card.style.display = 'block';
            });
        });
    }

    const addToCartButtons = document.querySelectorAll('.add-to-cart-button');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const productId = button.dataset.productId;

            try {
                const response = await fetch('/cart/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ productId, quantity: 1 }), 
                });

                const result = await response.json();
                if (result.success) {
                    alert('Товар успешно добавлен в корзину!');
                } else {
                    alert('Произошла ошибка при добавлении товара в корзину.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Произошла ошибка при отправке запроса на сервер.');
            }
        });
    });

    const removeItemButtons = document.querySelectorAll('.remove-item-btn');

    removeItemButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const cartItemElement = button.closest('.cart-item');
            const itemId = cartItemElement.dataset.itemId;
            const productId = cartItemElement.dataset.productId;

            try {
                const response = await fetch(`/cart/remove/${itemId}`, { 
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ productId }) 
                });

                const result = await response.json();
                if (result.success) {
                    if (result.quantityLeft > 0) {
                        cartItemElement.dataset.quantity = result.quantityLeft;
                        cartItemElement.querySelector('p:nth-child(3)').textContent = `Quantity: ${result.quantityLeft}`;
                    } else {
                        cartItemElement.remove();
                    }
                    alert('Товар удален из корзины!');
                } else {
                    alert('Произошла ошибка при удалении товара из корзины.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Произошла ошибка при отправке запроса на сервер.');
            }
        });
    });
});

