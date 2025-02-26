$(document).ready(function() {
    // Feature card animations
    $('.feature-card').hover(
        function() {
            $(this).css('transform', 'translateY(-5px)');
            $(this).css('box-shadow', '0 10px 15px rgba(0, 0, 0, 0.1)');
        },
        function() {
            $(this).css('transform', 'translateY(0)');
            $(this).css('box-shadow', '0 4px 6px rgba(0, 0, 0, 0.1)');
        }
    );
});
