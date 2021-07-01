(function ($) {

    

    var url = '';
    // var url = 'http://refinariadesign.com.br/sesc';

// Flipbook
    var largura = $(window).width();
    var x = 800;
    var y = 600;
    var z = 'double'

    if (largura < 1000) {
        x = 400;
        z = 'single';
    }

    $('.flipbook').css({
        'width': x + 'px',
        'height': y + 'px',
        'left': '-' + x / 2 + 'px',
        'top': '-' + y / 2 + 'px',
    });

    $(".flipbook").turn({ 
        width: x,
        height: y,
        display: z,
        autoCenter: true,
        when: {
            turning: function (event, page, view) {
                Hash.go('page/' + page).update();
            },
            turned: function (event, page, view) {
                var lastPage = $(".flipbook").turn('pages')
                console.log(lastPage);
                $('.page').removeClass('ativo');
                $('#p' + page).addClass('ativo');
                $(this).turn('center');
                $('#navNumber').val(page);
                $('.flipbook').css('opacity', 1);
                
                if (page == 1) {
                    $(this).turn('peel', 'br');
                    $('.nav-controle .prev').addClass('disabled');
                } else {
                    $('.nav-controle .prev').removeClass('disabled');
                }

                if (page === lastPage) {
                    $('.nav-controle .next').addClass('disabled');
                } else {
                    $('.nav-controle .next').removeClass('disabled');
                }
            }
        }
    });

    $('#navNumber').on('change', function(){
        var goTo = $(this).val();
        console.log(goTo);
        $('.flipbook').turn('page', goTo);
    });

    $('.nav-controle button').on('click', function(){
        var btn = $(this).attr('class');

        if (btn === 'prev') {
            $('.flipbook').turn('previous');
        }

        if (btn === 'next') {
            $('.flipbook').turn('next');
        }
    });

    $('nav button').on('click', function () {
        var targetPage = parseFloat($(this).text());
        $('.flipbook').turn('page', targetPage);
    });

    Hash.on('^page\/([0-9]*)$', {
        yep: function (path, parts) {
            var page = parts[1];
            if (page !== undefined) {
                if ($('.flipbook').turn('is'))
                    $('.flipbook').turn('page', page);
            }
        },
        nop: function (path) {
            if ($('.flipbook').turn('is'))
                $('.flipbook').turn('page', 1);
        }
    });

// Font-size
    $('.font-size-mais').on('click', function () {
        var p = $(this).closest('article').find('p')
        var fontSize = parseFloat(p.css('font-size'));
        var fontIncrement = fontSize + 1;
        if (fontSize <= 20) {
            p.css('font-size', fontIncrement);
        } else {
            $(this).addClass('disabled');
        }
    })

    $('.font-size-menos').on('click', function () {
        var p = $(this).closest('article').find('p')
        var fontSize = parseFloat(p.css('font-size'));
        var fontIncrement = fontSize - 1;
        if (fontSize >= 12) {
            var fontIncrement = fontSize - 1;
            p.css('font-size', fontIncrement);
        } else {
            $(this).addClass('disabled');
        }
    });

// Busca
    var buscaDB = [];

    $('.page').each(function () {
        var pageID = $(this).attr('id');
        var conteudo = $(this).find('article').text().toUpperCase();
        buscaDB.push({
            pageID: pageID,
            conteudo: conteudo
        });
    });

    $('form').on('submit', function (e) {
        e.preventDefault();
        var busca = $(this).find('input').val().toUpperCase();
        var buscaRes = 0;
        $(this).closest('.busca').addClass('busca-realizada');
        $('mark').contents().unwrap();
        if (busca !== '') {
            $('.resultados').empty();
            $.each(buscaDB, function (index, value) {
                if (value.conteudo.includes(busca)) {
                    var resultadoBruto  = value.conteudo;
                    var resultadoSplit = resultadoBruto.split(busca).pop().substring(1, 25);
                    var resultadoFormatado = '... <strong>' + busca + '</strong> ' + resultadoSplit + ' ...';
                    var pageNum = value.pageID.substring(1);
                    var pageLink = '/#page/' + pageNum;
                    buscaRes++;
                    $('#' + value.pageID).mark(busca);
                    $('.resultados').append('<div><a href="' + url + pageLink + '">' + value.pageID + ' | ' + resultadoFormatado + '</a></div>');
                }

            });
            if (buscaRes === 0) {
                $('.resultados').append('nada encontrado');
            }
        }
        if (busca === '') {
            $('.resultados').empty();
        }
    });

    $('.busca input').on('input', function(){
        var buscaString = $(this).val();
        if (buscaString == '') {
            $('.resultados').empty();
            $('mark').contents().unwrap();
        }
    });
})(jQuery);