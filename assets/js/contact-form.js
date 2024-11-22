$(document).ready(function() {
    // Phone mask
    $('#phoneNumber').mask('(00) 00000-0000', {
        placeholder: "(00) 00000-0000"
    });

    // Custom validation method for WhatsApp (Brazilian numbers)
    $.validator.addMethod("whatsapp", function(value, element) {
        value = value.replace(/\D/g, '');
        return this.optional(element) || /^[1-9][1-9]9\d{8}$/.test(value);
    }, "Por favor, insira um número de WhatsApp válido");

    // Custom validation method for company email
    $.validator.addMethod("corporate", function(value, element) {
        const freeEmails = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'live.com', 'bol.com.br', 'uol.com.br'];
        const domain = value.split('@')[1];
        return this.optional(element) || !freeEmails.includes(domain.toLowerCase());
    }, "Por favor, use seu e-mail corporativo");

    // Initialize form validation
    const validator = $("#contactForm").validate({
        // Force validation on all fields immediately when submitting
        onkeyup: false,
        onfocusout: false,
        onclick: false,
        
        errorElement: 'span',
        errorClass: 'error-message',
        validClass: 'success',
        
        // Highlight error fields
        highlight: function(element, errorClass, validClass) {
            $(element)
                .addClass('error-input')
                .removeClass(validClass);
            
            $(element).closest('.form-group').addClass('has-error');
            
            // Add shake animation to highlight errors
            $(element).closest('.form-group').addClass('shake-error');
            setTimeout(() => {
                $(element).closest('.form-group').removeClass('shake-error');
            }, 500);
        },
        
        // Remove highlighting from valid fields
        unhighlight: function(element, errorClass, validClass) {
            $(element)
                .removeClass('error-input')
                .addClass(validClass);
            
            $(element).closest('.form-group').removeClass('has-error');
        },
        
        // Validation rules
        rules: {
            name: {
                required: true,
                minlength: 3
            },
            companyName: {
                required: true,
                minlength: 2
            },
            companySize: {
                required: true
            },
            phoneNumber: {
                required: true,
                whatsapp: true
            },
            email: {
                required: true,
                email: true,
                corporate: true
            },
            description: {
                required: true,
                minlength: 10
            }
        },
        
        // Custom error messages
        messages: {
            name: {
                required: "Nome é obrigatório",
                minlength: "O nome deve ter pelo menos 3 caracteres"
            },
            companyName: {
                required: "Nome da empresa é obrigatório",
                minlength: "O nome da empresa deve ter pelo menos 2 caracteres"
            },
            companySize: {
                required: "Selecione o tamanho da empresa"
            },
            phoneNumber: {
                required: "WhatsApp é obrigatório"
            },
            email: {
                required: "E-mail é obrigatório",
                email: "Insira um e-mail válido"
            },
            description: {
                required: "Descrição é obrigatória",
                minlength: "A descrição deve ter pelo menos 10 caracteres"
            }
        },
        
        // Handle form submission
        submitHandler: function(form) {
            const submitButton = $(form).find('button[type="submit"]');
            const originalText = submitButton.html();
            
            submitButton.prop('disabled', true).html(`
                <span class="flex items-center gap-2">
                    <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enviando...
                </span>
            `);

            const formData = {
                name: $('#name').val().trim(),
                companyName: $('#companyName').val().trim(),
                companySize: $('#companySize').val(),
                phoneNumber: $('#phoneNumber').val().replace(/\D/g, ''),
                email: $('#email').val().trim(),
                description: $('#description').val().trim()
            };

            $.ajax({
                url: 'https://webhookn8n.otimiza.ai/webhook/main_sdr_agent',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(formData),
                success: function(response) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Sucesso!',
                        text: 'Em breve você receberá uma mensagem no WhatsApp e uma ligação da nossa IA!',
                        confirmButtonColor: '#4F46E5'
                    });
                    form.reset();
                    // Remove success classes after reset
                    $('.success').removeClass('success');
                },
                error: function(xhr, status, error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Ops!',
                        text: 'Ocorreu um erro ao enviar seus dados. Por favor, tente novamente.',
                        confirmButtonColor: '#4F46E5'
                    });
                    console.error('Error:', error);
                },
                complete: function() {
                    submitButton.prop('disabled', false).html(originalText);
                }
            });
        }
    });

    // Handle submit button click
    $('#contactForm button[type="submit"]').on('click', function(e) {
        e.preventDefault();
        
        // Get the button element
        const submitButton = $(this);
        
        // If the button is disabled, don't proceed
        if (submitButton.prop('disabled')) {
            return;
        }
        
        // Trigger validation on all fields
        if ($("#contactForm").valid()) {
            // Disable button and show loading state
            submitButton.prop('disabled', true);
            const originalText = submitButton.html();
            submitButton.html(`
                <span class="flex items-center gap-2">
                    <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enviando...
                </span>
            `);

            // Prepare form data
            const formData = {
                name: $('#name').val().trim(),
                companyName: $('#companyName').val().trim(),
                companySize: $('#companySize').val(),
                phoneNumber: '+55' + $('#phoneNumber').val().replace(/\D/g, ''),
                email: $('#email').val().trim(),
                description: $('#description').val().trim()
            };

            // Submit form
            $.ajax({
                url: 'https://webhookn8n.otimiza.ai/webhook/main_sdr_agent',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(formData),
                success: function(response) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Sucesso!',
                        text: 'Em breve você receberá uma mensagem no WhatsApp e uma ligação da nossa IA!',
                        confirmButtonColor: '#4337C9'
                    });
                    $("#contactForm")[0].reset();
                    // Remove success classes after reset
                    $('.success').removeClass('success');
                },
                error: function(xhr, status, error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Ops!',
                        text: 'Ocorreu um erro ao enviar seus dados. Por favor, tente novamente.',
                        confirmButtonColor: '#4337C9'
                    });
                    console.error('Error:', error);
                },
                complete: function() {
                    // Re-enable button and restore original text
                    submitButton.prop('disabled', false).html(originalText);
                }
            });
        } else {
            // If validation fails, scroll to first error
            const firstError = $('.error-input').first();
            if (firstError.length) {
                $('html, body').animate({
                    scrollTop: firstError.offset().top - 100
                }, 500);
            }
            
            // Show error toast
            Swal.fire({
                icon: 'warning',
                title: 'Atenção!',
                text: 'Por favor, preencha todos os campos obrigatórios corretamente.',
                confirmButtonColor: '#4337C9'
            });
        }
    });
}); 