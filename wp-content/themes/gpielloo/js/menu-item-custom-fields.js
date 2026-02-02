(function($) {
    
    $(document).on('click', '.select-image', function(e) {
        e.preventDefault();
        
        var button = $(this);
        var wrapper = button.closest('.menu-item-image-wrapper');
        var imageInput = wrapper.find('.menu-item-image');
        var imagePreview = wrapper.find('.image-preview');
        var removeButton = wrapper.find('.remove-image');
        
        var frame = wp.media({
            title: 'Select Menu Item Image',
            multiple: false,
            library: {
                type: 'image'
            }
        });

        frame.on('select', function() {
            var attachment = frame.state().get('selection').first().toJSON();

            imageInput.val(attachment.id);
            
            let thumbnail = !attachment.sizes.thumbnail ? attachment.url : attachment.sizes.thumbnail.url;
            
            imagePreview.html('<img src="' + thumbnail + '" style="max-width: 100%; height: auto;">');
            removeButton.show();
        });

        frame.open();
    });

    $(document).on('click', '.remove-image', function(e) {
        e.preventDefault();
        
        var button = $(this);
        var wrapper = button.closest('.menu-item-image-wrapper');
        var imageInput = wrapper.find('.menu-item-image');
        var imagePreview = wrapper.find('.image-preview');
        
        imageInput.val('');
        imagePreview.empty();
        button.hide();
    });
    
})(window.jQuery);