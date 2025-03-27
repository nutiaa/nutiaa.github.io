document.addEventListener("DOMContentLoaded", function() {
    const sceneEl = document.getElementById('scene')
    const topCenterTextEl = document.querySelector('.text.top-center')

    function showScene1(){
        sceneEl.classList.add('scene-1')
        sceneEl.innerHTML = '<button type="button">Получить билет</button>'

        document.querySelector('#scene.scene-1 button').addEventListener('click', function(){
            hideScene1()
            showScene2()
        })
    }
    function hideScene1(){
        sceneEl.classList.remove('scene-1')
        sceneEl.innerHTML = ''
    }

    function showScene2(){
        sceneEl.classList.add('scene-2')
        topCenterTextEl.innerText = 'Выберите билетик!'
        sceneEl.innerHTML = `
            <p id="ticket-1-text" class="ticket-text">Приглашаем</p>
            <p id="ticket-2-text" class="ticket-text">Вас<br/>и Ваших друзей</p>
            <p id="ticket-3-text" class="ticket-text">на спектакль!</p>
            <p id="ticket-4-text" class="ticket-text">Приглашаем Вас на спектакль<br/>«Пространство движения»<br/>25 марта, 19:00<br/>Пантелеевская,56</p>
        `

        let clickedCount = 0
        document.querySelectorAll('.ticket-text').forEach(function(el) {
            el.addEventListener('click', function(){
                if (!el.classList.contains('active')) {
                    el.classList.add('active')
                    clickedCount ++
                }

                if (clickedCount === 4) {
                    setTimeout(function () {
                        hideScene2()
                        showScene3()
                    }, 2000)
                }
            })
        })
    }
    function hideScene2(){
        sceneEl.classList.remove('scene-2')
        topCenterTextEl.innerText = ''
        sceneEl.innerHTML = ''
    }

    function showScene3(){
        sceneEl.classList.add('scene-3')
        topCenterTextEl.innerText = 'Насладитесь спектаклем!'
        sceneEl.innerHTML = `
            <div id="circle-dancer" class="figure-dancer"></div>
            <div id="rectangle-dancer" class="figure-dancer"></div>
            <div id="triangle-dancer" class="figure-dancer"></div>
        `

        document.querySelectorAll('.figure-dancer').forEach(function(el) {
            el.addEventListener('click', function(){
                el.classList.toggle('active')

                if (document.querySelectorAll('.figure-dancer.active').length === 3) {
                    setTimeout(function () {
                        hideScene3()
                        showScene4()
                    }, 5000)
                }
            })
        })
    }
    function hideScene3(){
        sceneEl.classList.remove('scene-3')
        topCenterTextEl.innerText = ''
        sceneEl.innerHTML = ''
    }

    function showScene4(){
        sceneEl.classList.add('scene-4')
        topCenterTextEl.innerText = 'Вам понравился спектакль?'
        sceneEl.innerHTML = `
            <p id="score-1" class="score">10</p>
            <p id="score-2" class="score">10</p>
            <p id="score-3" class="score">10</p>
            <input type="text" id="score-4" class="score" maxlength="2">
        `
    }

    showScene1()
})
