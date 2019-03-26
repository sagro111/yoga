window.addEventListener('DOMContentLoaded', function () {

    'use strict'

    let tab = document.querySelectorAll('.info-header-tab'),
        info = document.querySelector('.info-header'),
        tabContent = document.querySelectorAll('.info-tabcontent');

    function hideTabContent(a) {
        for (let i = a; i < tabContent.length; i++) {
            tabContent[i].classList.remove('show');
            tabContent[i].classList.add('hide');
        }
    }

    hideTabContent(1);

    function showTabContent(b) {
        if (tabContent[b].classList.contains('hide')) {
            tabContent[b].classList.remove('hide');
            tabContent[b].classList.add('show');
        }
    }

    info.addEventListener('click', function (event) {
        let target = event.target;

        if (target && target.classList.contains('info-header-tab')) {
            for (let i = 0; i < tab.length; i++) {
                if (target == tab[i]) {
                    hideTabContent(0);
                    showTabContent(i);
                    break;
                }
            }
        }
    });

    //TIMER

    let deadline = '2019-03-14';

    function getTimeReamening(endtime) {
        let t = Date.parse(endtime) - Date.parse(new Date()),
            seconds = Math.floor((t / 1000) % 60),
            minutes = Math.floor((t / 1000 / 60) % 60),
            hours = Math.floor((t / (1000 * 60 * 60)));

        return {
            'total': t,
            'seconds': seconds,
            'minutes': minutes,
            'hours': hours
        };
    }

    function setClock(id, endtime) {
        let timer = document.getElementById(id),
            hours = timer.querySelector('.hours'),
            minutes = timer.querySelector('.minutes'),
            seconds = timer.querySelector('.seconds'),
            intervalId = setInterval(clockUpdate, 1000);

        function clockUpdate() {
            let t = getTimeReamening(endtime);

            function setZero(num) {
                if (num < 10) {
                    return '0' + num;
                } else return num;
            }

            seconds.textContent = setZero(t.seconds);
            minutes.textContent = setZero(t.minutes);
            hours.textContent = setZero(t.hours);



            if (t.total <= 0) {
                clearInterval(intervalId);
                seconds.textContent = '00';
                minutes.textContent = '00';
                hours.textContent = '00';
            }

        }
    }

    setClock('timer', deadline);


    //Modal Window


    let btnShowModal = document.querySelector('.more'),
        modalWindow = document.querySelector('.overlay'),
        btnCloseModal = document.querySelector('.popup-close'),
        btnModal = document.querySelectorAll('.description-btn');

    btnShowModal.addEventListener('click', showModal);
    btnCloseModal.addEventListener('click', closeModal);
    btnModal.forEach(function (item) {
        item.addEventListener('click', showModal);
    });

    function showModal() {
        modalWindow.style.display = 'block';
        this.classList.add('more-splash');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modalWindow.style.display = 'none';
        btnShowModal.classList.remove('more-splash');
        document.body.style.overflow = '';
    };

    modalWindow.addEventListener('click', function (event) {
        let target = event.target;

        if (target && target.classList.contains('overlay')) {
            closeModal();
        }
    });


    //Form

    let status = {
        'error': 'Что-то пошло не так!',
        'loading': 'Запрос загружается',
        'complete': 'Спасибо, скоро мы с вами свяжемся'
    };

    let form = document.querySelector('.main-form'),
        input = document.getElementsByTagName('input'),
        statusMessage = document.createElement('div');

    statusMessage.classList.add('status');

    form.addEventListener('submit', sendOrder);

    function sendOrder(event) {
        event.preventDefault();
        form.appendChild(statusMessage);

        let request = new XMLHttpRequest();
        request.open('POST', 'server.php');
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        let formData = new FormData(form);
        request.send(formData);

        request.addEventListener('readystatechange', function() {
            if (request.readyState < 4) {
                statusMessage.innerHTML = status.loading;
            } else if ( request.readyState === 4 && request.status == 200 ) {
                statusMessage.innerHTML = status.complete;
            } else {
                statusMessage.innerHTML = status.error;
            }
        });

        for ( let i = 0; i < input.length; i++) {
            input.value = '';
        }
    }

});