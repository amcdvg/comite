document.querySelector('.form-container form').addEventListener('submit', function (event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    // Validación de campos obligatorios
    if (!formData.get('Nombre Completo')) {
        showCustomAlert('Por favor, completa todos los campos requeridos.', 'warning');
        return;
    }

    // Validación del checkbox de autorización
    const autorizacionCheckbox = document.getElementById('autorizacion');
    if (!autorizacionCheckbox.checked) {
        showCustomAlert('Debes autorizar el tratamiento de datos personales para continuar.', 'warning');
        return;
    }

    showLoadingSpinner();
    
    // Ya no verificamos el número de identificación, procedemos directamente a enviar
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });
    console.log(data);
    
    // Envío de datos al servidor
    sendDataToServer(data, form);
});

// Ya no hay validación en tiempo real del número de identificación (se eliminó)

// Función para enviar datos al servidor
function sendDataToServer(data, form) {
    const scriptURL = "https://script.google.com/macros/s/AKfycbyXh_eRT1LCrmHSXnFYJ_jCcVGtsMbkjtctnQ3aINZo1CR4EiNZckWsD5YKh1WgJ-3I/exec";
    console.log(data);
    
    fetch(scriptURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        mode: "no-cors",
        body: JSON.stringify(data)
    })
    .then(response => {
        console.log(response);
        hideLoadingSpinner();
        showCustomAlert('¡Formulario enviado con éxito! Gracias por tu registro.', 'success');
        form.reset();
    })
    .catch(error => {
        hideLoadingSpinner();
        showCustomAlert('Hubo un error al enviar el formulario. Por favor, inténtalo de nuevo más tarde.', 'error');
        console.error('Error:', error);
    });
}

// Función para mostrar spinner de carga
function showLoadingSpinner() {
    const spinner = document.createElement('div');
    spinner.id = 'loading-spinner';
    spinner.style.position = 'fixed';
    spinner.style.top = '0';
    spinner.style.left = '0';
    spinner.style.width = '100%';
    spinner.style.height = '100%';
    spinner.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    spinner.style.display = 'flex';
    spinner.style.justifyContent = 'center';
    spinner.style.alignItems = 'center';
    spinner.style.zIndex = '1000';
    spinner.innerHTML = `
        <div style="width: 50px; height: 50px; border: 5px solid rgba(255, 255, 255, 0.3); border-top: 5px solid var(--primary-color); border-radius: 50%; animation: spin 1s linear infinite;"></div>
        <style>
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        </style>
    `;
    document.body.appendChild(spinner);
}

// Función para ocultar spinner de carga
function hideLoadingSpinner() {
    const spinner = document.getElementById('loading-spinner');
    if (spinner) {
        document.body.removeChild(spinner);
    }
}

// Función para mostrar alertas personalizadas
function showCustomAlert(message, type) {
    const existingAlert = document.querySelector('.custom-alert');
    if (existingAlert) {
        document.body.removeChild(existingAlert);
    }

    const alertBox = document.createElement('div');
    alertBox.className = `custom-alert ${type}`;
    
    let icon, textColor, borderColor;
    switch(type) {
        case 'success':
            icon = 'fas fa-check-circle';
            textColor = '#28a745';
            borderColor = '#28a745';
            break;
        case 'error':
            icon = 'fas fa-times-circle';
            textColor = '#dc3545';
            borderColor = '#dc3545';
            break;
        case 'warning':
            icon = 'fas fa-exclamation-circle';
            textColor = '#ffc107';
            borderColor = '#ffc107';
            break;
        default:
            icon = 'fas fa-info-circle';
            textColor = '#17a2b8';
            borderColor = '#17a2b8';
    }

    alertBox.innerHTML = `
        <div class="alert-content">
            <i class="${icon}"></i>
            <span class="alert-message">${message}</span>
        </div>
    `;
    document.body.appendChild(alertBox);

    const styles = `
        .custom-alert {
            position: fixed;
            top: 250px;
            left: 50%;
            transform: translateX(-50%);
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            z-index: 9999;
            width: 90%;
            max-width: 400px;
            animation: fadeInDown 0.4s ease-out;
            border-left: 4px solid ${borderColor};
            overflow: hidden;
        }
        .alert-content {
            display: flex;
            align-items: center;
            padding: 16px 20px;
            gap: 14px;
        }
        .custom-alert i {
            font-size: 26px;
            color: ${borderColor};
        }
        .alert-message {
            font-family: 'Poppins', sans-serif;
            font-size: 15px;
            font-weight: bold !important;
            font-style: italic !important;
            color: ${textColor} !important;
            white-space: pre-line;
            line-height: 1.4;
            margin: 0;
        }
        @keyframes fadeInDown {
            from { 
                opacity: 0; 
                transform: translate(-50%, -20px); 
            }
            to { 
                opacity: 1; 
                transform: translate(-50%, 0); 
            }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    setTimeout(() => {
        alertBox.style.animation = 'fadeOut 0.4s ease-out forwards';
        setTimeout(() => {
            if (document.body.contains(alertBox)) {
                document.body.removeChild(alertBox);
            }
            if (document.head.contains(styleSheet)) {
                document.head.removeChild(styleSheet);
            }
        }, 400);
    }, 4000);
}

// Script para manejar la lógica del formulario
        document.addEventListener('DOMContentLoaded', function() {
            const comiteConstituidoSelect = document.getElementById('comite-constituido');
            const comiteFuncionandoSelect = document.getElementById('comite-funcionando');
            const integranteIdmjiSelect = document.getElementById('integrante-idmji');
            
            // Función para habilitar/deshabilitar campos condicionalmente
            function toggleConditionalFields() {
                if (comiteConstituidoSelect.value === 'No') {
                    // Si el comité NO está constituido, deshabilitar los campos siguientes
                    comiteFuncionandoSelect.disabled = true;
                    integranteIdmjiSelect.disabled = true;
                    comiteFuncionandoSelect.value = '';
                    integranteIdmjiSelect.value = '';
                } else if (comiteConstituidoSelect.value === 'Si' && comiteFuncionandoSelect.value === 'No') {
                    // Si el comité está constituido pero NO está funcionando, deshabilitar solo el último campo
                    comiteFuncionandoSelect.disabled = false;
                    integranteIdmjiSelect.disabled = true;
                    integranteIdmjiSelect.value = '';
                } else {
                    // Si el comité está constituido y está funcionando, habilitar todos los campos
                    comiteFuncionandoSelect.disabled = false;
                    integranteIdmjiSelect.disabled = false;
                }
            }
            
            // Ejecutar la función al cargar la página
            toggleConditionalFields();
            
            // Ejecutar la función cuando cambien las selecciones
            comiteConstituidoSelect.addEventListener('change', toggleConditionalFields);
            comiteFuncionandoSelect.addEventListener('change', toggleConditionalFields);
            
            // Validación del formulario
            
        });