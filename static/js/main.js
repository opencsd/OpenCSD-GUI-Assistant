var dbmsType = "opencsd";
var allocate = "";

$(function(){
	$("#wizard").steps({
        headerTag: "h2",
        bodyTag: "section",
        transitionEffect: "fade",
        enableAllSteps: true,
        transitionEffectSpeed: 400,
        labels: {
            finish: "Create",
            next: "Forward",
            previous: "Backward"
        },
        // onFinished: go
    });
    $('.wizard > .steps li a').click(function(){
    	$(this).parent().addClass('checked');
		$(this).parent().prevAll().addClass('checked');
		$(this).parent().nextAll().removeClass('checked');
    });
    // Custome Jquery Step Button
    $('.forward').click(function(){
    	$("#wizard").steps('next');
    })
    $('.backward').click(function(){
        $("#wizard").steps('previous');
    })
    // Select Dropdown
    $('html').click(function() {
        $('.select .dropdown').hide(); 
    });
    $('.select').click(function(event){
        event.stopPropagation();
    });
    $('.select .select-control').click(function(){
        $(this).parent().next().toggle();
    })    
    $('.select .dropdown li').click(function(){
        $(this).parent().toggle();
        var text = $(this).attr('rel');
        $(this).parent().prev().find('div').text(text);
    })

    $('.dbms-type').click(function() {
        var inputValue = $(this).val();
        dbmsType = inputValue;
        if (inputValue === 'mysql') {
            $('.mysql-form').show();
            $('.opencsd-form').hide();
        } else {
            $('.mysql-form').hide();
            $('.opencsd-form').show();
        }
    });

    $('input[name=confirmInstanceName]').attr('value','default-name');
    $('input[name=confirmVolumeAllocate]').attr('value','1GB');
    $('input[name=confirmCSDCount]').attr('value','8');

    $('input[name=instanceName]').change(function(){
		$('input[name=confirmInstanceName]').attr('value',$('input[name=instanceName]').val());
	});

    $('#csdVolumeAllocate').change(function(){  
        var volume = $('#csdVolumeAllocate').val();
        var scale = $('#csdVolumeScale').text();
        if(scale == "TB"){
            allocate = volume + "TB";
        }else if(scale == "MB"){
            allocate = volume + "MB";
        }else{
            allocate = volume + "GB";
        }
        
        $('input[name=confirmVolumeAllocate]').attr('value',allocate);
	});

    $('#ssdVolumeAllocate').change(function(){  
        var volume = $('#ssdVolumeAllocate').val();
        var scale = $('#ssdVolumeScale').text();
        if(scale == "TB"){
            allocate = volume + "TB";
        }else if(scale == "MB"){
            allocate = volume + "MB";
        }else{
            allocate = volume + "GB";
        }
    
        $('input[name=confirmVolumeAllocate]').attr('value',allocate);
	});

    $('#csdVolumeScale').on('DOMSubtreeModified', function(){
        var volume = $('#csdVolumeAllocate').val();
        var scale = $('#csdVolumeScale').text();
        if(scale == "TB"){
            allocate = volume + "TB";
        }else if(scale == "MB"){
            allocate = volume + "MB";
        }else{
            allocate = volume + "GB";
        }
        
        $('input[name=confirmVolumeAllocate]').attr('value',allocate);
    });

    $('#ssdVolumeScale').on('DOMSubtreeModified', function(){
        var volume = $('#ssdVolumeAllocate').val();
        var scale = $('#ssdVolumeScale').text();
        if(scale == "TB"){
            allocate = volume + "TB";
        }else if(scale == "MB"){
            allocate = volume + "MB";
        }else{
            allocate = volume + "GB";
        }
        
        $('input[name=confirmVolumeAllocate]').attr('value',allocate);
    });

    $('input[name=csdCount]').change(function(){
		$('input[name=confirmCSDCount]').attr('value',$('input[name=csdCount]').val());
	});
})
