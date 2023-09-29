

// A $( document ).ready() block.
$( document ).ready(function() {
    console.log('oi');
    $("#close-mobile-menu, .mobile-item-menu").click(function(){
        console.log('hide');
        $("#headlessui-portal-root").hide();
    });

    $("#open-mobile-menu").click(function(){
        console.log('show');
        $("#headlessui-portal-root").show();
    });
});