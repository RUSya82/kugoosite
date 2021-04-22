document.addEventListener('DOMContentLoaded', () => {

    /**
     * send POST-data by PHPMailer
     * @param body
     * @returns {Promise<Response>}
     */
    const postData = (body) => {
        return fetch('send.php', {
            body: body,
            method: 'POST',
        });
    };

    /**
     * show thanks modal & hide after 3 sec
     */
    const showThanksModal = () => {
        const modalThanksObj = new bootstrap.Modal(modalThanks);
        modalThanksObj.show();
        //hide thanks after 3 sec
        setTimeout(() => {
            modalThanksObj.hide();
        }, 3000);
    };

    /**
     * bind mask for phone number
     * @param selector
     * @param masked
     */
    const maskPhone = (selector, masked = '+7 (___) ___-__-__') => {
        const elems = document.querySelectorAll(selector);

        function mask(event) {
            const keyCode = event.keyCode;
            const template = masked,
                def = template.replace(/\D/g, ""),
                val = this.value.replace(/\D/g, "");
            let i = 0,
                newValue = template.replace(/[_\d]/g, function (a) {
                    return i < val.length ? val.charAt(i++) || def.charAt(i) : a;
                });
            i = newValue.indexOf("_");
            if (i != -1) {
                newValue = newValue.slice(0, i);
            }
            let reg = template.substr(0, this.value.length).replace(/_+/g,
                function (a) {
                    return "\\d{1," + a.length + "}";
                }).replace(/[+()]/g, "\\$&");
            reg = new RegExp("^" + reg + "$");
            if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) {
                this.value = newValue;
            }
            if (event.type == "blur" && this.value.length < 5) {
                this.value = "";
            }

        }

        for (const elem of elems) {
            elem.addEventListener("input", mask);
            elem.addEventListener("focus", mask);
            elem.addEventListener("blur", mask);
        }
    };
    //set phone mask for forms
    maskPhone('input[name=tel]');
    maskPhone('input[name=phone]');


    const bindModalForm = () => {
        // модалки
        const exampleModalQuestion = document.querySelector('#exampleModalQuestion');
        const exampleModal = document.querySelector('#exampleModal');
        const exampleModalCheckout = document.querySelector('#exampleModalCheckout');
        const exampleModalCredit = document.querySelector('#exampleModalCredit');
        const exampleModalSupport = document.querySelector('#exampleModalSupport');

        /**
         * send data from modal forms after submit
         * @param targetModal - modal for binding(element)
         */
        const modalFormSender = (targetModal) => {
            const modalHeader = targetModal.querySelector('.modal-header h5');
            const modalImage = targetModal.querySelector('.modal-header img');
            const modalForm = targetModal.querySelector('form');
            const modalPrice = targetModal.querySelector('.modal-price');
            const close = targetModal.querySelector('.btn-close');

            modalForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(modalForm);
                // name повторяется, $_POST не дает дублировать, переименовываем поля
                const name = formData.getAll('name');
                const userName = name[0];
                const address = name[1];
                // add fields
                formData.set('name', userName.trim()); //rewrite all fields "name"
                if(address){
                    formData.append('address', address.trim());
                }
                formData.append('head', modalHeader.textContent);
                if(modalImage){
                    const imageUrl = `http://${window.location.hostname}${modalImage.getAttribute('src')}`;
                    formData.append('image', imageUrl);
                }
                let modalPriceText = '';
                if(modalPrice){
                    modalPriceText = modalPrice.textContent.replace(/Итого:/, '');
                }
                formData.append('price', modalPriceText);
                //close bootstrap modal
                let event = new Event("click");
                close.dispatchEvent(event);
                // send data
                postData(formData)
                    .then((response) => {
                        if (response.status !== 200) {
                            throw new Error('status not 200');
                        }
                        return response.text()
                    }).then((response) => {
                        modalForm.reset();
                        //show thanks
                        showThanksModal();
                    }).catch((error) => {
                        console.error(error);
                    });
            });

        };
        // bind modals
        modalFormSender(exampleModalQuestion);
        modalFormSender(exampleModal);
        modalFormSender(exampleModalCheckout);
        modalFormSender(exampleModalCredit);
        modalFormSender(exampleModalSupport);

    };
    bindModalForm();

    // отдельная форма помощи, не модалка
    const helpFormSender = () => {
        const helpBlock = document.getElementById('help');
        const header = helpBlock.querySelector('h3');
        const form = helpBlock.querySelector('form');

        form.addEventListener('submit', (e) => {
            const target = e.target;
            e.preventDefault();
            const formData = new FormData(target);
            formData.append('head', header.textContent);
            postData(formData)
                .then((response) => {
                    if (response.status !== 200) {
                        throw new Error('status not 200');
                    }
                    return response.text()
                }).then((response) => {
                target.reset();
                showThanksModal();
            }).catch((error) => {
                console.error(error);
            });
        });
    };
    helpFormSender();

});