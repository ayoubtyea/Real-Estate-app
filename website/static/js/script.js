document.addEventListener('DOMContentLoaded', function () {
    const burger = document.querySelector('.navbar-burger');
    const menu = document.querySelector('.navbar-menu');
    const close = document.querySelector('.navbar-close');
    const backdrop = document.querySelector('.navbar-backdrop');

    burger.addEventListener('click', function () {
        menu.classList.toggle('hidden');
        backdrop.classList.toggle('hidden');
    });

    close.addEventListener('click', function () {
        menu.classList.add('hidden');
        backdrop.classList.add('hidden');
    });

    backdrop.addEventListener('click', function () {
        menu.classList.add('hidden');
        backdrop.classList.add('hidden');
    });
});

// Cards 
const state = {};
const carouselList = document.querySelector('.carousel__list');
const carouselItems = document.querySelectorAll('.carousel__item');
const elems = Array.from(carouselItems);

carouselList.addEventListener('click', function (event) {
    var newActive = event.target;
    var isItem = newActive.closest('.carousel__item');

    if (!isItem || newActive.classList.contains('carousel__item_active')) {
        return;
    };

    update(newActive);
});

const update = function (newActive) {
    const newActivePos = newActive.dataset.pos;

    const current = elems.find((elem) => elem.dataset.pos == 0);
    const prev = elems.find((elem) => elem.dataset.pos == -1);
    const next = elems.find((elem) => elem.dataset.pos == 1);
    const first = elems.find((elem) => elem.dataset.pos == -2);
    const last = elems.find((elem) => elem.dataset.pos == 2);

    current.classList.remove('carousel__item_active');

    [current, prev, next, first, last].forEach(item => {
        var itemPos = item.dataset.pos;

        item.dataset.pos = getPos(itemPos, newActivePos)
    });
};

const getPos = function (current, active) {
    const diff = current - active;

    if (Math.abs(current - active) > 2) {
        return -current
    }

    return diff;
}


// SLIDE PAGE
function toggleSlideover() {
    document.getElementById('slideover-container').classList.toggle('invisible');
    document.getElementById('slideover-bg').classList.toggle('opacity-0');
    document.getElementById('slideover-bg').classList.toggle('opacity-50');
    document.getElementById('slideover').classList.toggle('translate-x-full');
}


document.addEventListener("DOMContentLoaded", function () {
    const carouselItems = document.querySelectorAll('.carousel__item');
    carouselItems.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('animate-move-up');
        }, index * 500);
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const carouselItem = document.querySelector('.carousel__item');
    carouselItem.classList.add('animate-move-right');
});

$(document).ready(function () {
    $('select').change(function () {
        var bedrooms = $('select:eq(0)').val();
        var bathrooms = $('select:eq(1)').val();
        var floors = $('select:eq(2)').val();
        var waterfront = $('select:eq(3)').val();

        $.ajax({
            url: '/predict',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                bedrooms: bedrooms,
                bathrooms: bathrooms,
                floors: floors,
                waterfront: waterfront
            }),
            success: function (response) {
                $('.price button').text(response.predicted_price.toFixed(2) + ' $');
            }
        });
    });
});

// Drop DOWN 

function toggleDropdown() {
    document.getElementById('dropdownMenu').classList.toggle('hidden');
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function (event) {
    if (!event.target.matches('.relative button')) {
        var dropdowns = document.getElementsByClassName('dropdown-content');
        for (var i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (!openDropdown.classList.contains('hidden')) {
                openDropdown.classList.add('hidden');
            }
        }
    }
}
