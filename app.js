document.addEventListener('DOMContentLoaded', () => {
    // --- Referencias al DOM ---
    const sidebar = document.getElementById('sidebar');
    const menuBtn = document.getElementById('menu-btn');
    const closeBtn = document.getElementById('close-btn');
    const navLinks = document.querySelectorAll('.nav-link');
    const pageSections = document.querySelectorAll('.page-section');
    const dropdownBtn = document.querySelector('.dropdown-btn');
    const navDropdown = document.querySelector('.nav-dropdown');

    // --- Lógica Menú Móvil ---
    function toggleSidebar() {
        sidebar.classList.toggle('open');
    }

    menuBtn.addEventListener('click', toggleSidebar);
    closeBtn.addEventListener('click', toggleSidebar);

    // --- Lógica Dropdown (Proyectos) ---
    dropdownBtn.addEventListener('click', () => {
        navDropdown.classList.toggle('active');
    });

    // --- Lógica SPA (Navegación sin recargar) ---
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            // Evitar accion si ya esta activo
            if (this.classList.contains('active')) return;

            // 1. Actualizar estado de los enlaces
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            // 2. Si es un sub-link, asegurar que el padre dropdown también esté abierto
            if (this.classList.contains('sub-link')) {
                navDropdown.classList.add('active');
            }

            // 3. Cambiar la sección visible
            const targetId = this.getAttribute('data-target');
            
            pageSections.forEach(section => {
                section.classList.remove('active-section');
            });

            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active-section');
            }

            // 4. En móvil, cerrar el sidebar después de seleccionar una opción
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('open');
            }
            
            // 5. Scroll al inicio (opcional si la página es larga)
            window.scrollTo(0,0);
        });
    });

    // --- Limpieza de localStorage de meses pasados ---
    const cleanOldMeetings = () => {
        let meetings = JSON.parse(localStorage.getItem('galo_meetings')) || [];
        const currentMonthYear = new Date().toISOString().slice(0, 7); // 'YYYY-MM'
        
        // Mantener solo las del mes actual o futuro
        meetings = meetings.filter(m => m.monthYear >= currentMonthYear);
        localStorage.setItem('galo_meetings', JSON.stringify(meetings));
    };
    cleanOldMeetings();

    // --- Lógica Formulario de Contacto (Google Calendar) ---
    const formContacto = document.getElementById('form-contacto');
    const inputFecha = document.getElementById('fecha');
    const inputHora = document.getElementById('hora');
    const warningLimit = document.getElementById('warning-limit');

    if (formContacto) {
        // Mostrar advertencia si fecha y hora están llenos
        const checkInputs = () => {
            if (inputFecha.value && inputHora.value) {
                warningLimit.style.display = 'flex';
            } else {
                warningLimit.style.display = 'none';
            }
        };

        if (inputFecha && inputHora) {
            inputFecha.addEventListener('change', checkInputs);
            inputHora.addEventListener('change', checkInputs);
        }

        formContacto.addEventListener('submit', function(e) {
            e.preventDefault();

            const nombre = document.getElementById('nombre').value;
            const email = document.getElementById('email').value.trim().toLowerCase();
            const telefono = document.getElementById('telefono').value;
            const mensaje = document.getElementById('mensaje').value;
            const fechaStr = document.getElementById('fecha').value; // YYYY-MM-DD
            const horaStr = document.getElementById('hora').value; // HH:MM

            // 1. Caso: Solo enviar mensaje (sin agendar)
            if (!fechaStr && !horaStr) {
                alert('¡Gracias! Tu consulta ha sido enviada a Galo. Nos pondremos en contacto contigo a la brevedad.');
                formContacto.reset();
                if (warningLimit) warningLimit.style.display = 'none';
                return;
            }

            // 2. Caso: Llenó a medias la agenda
            if ((fechaStr && !horaStr) || (!fechaStr && horaStr)) {
                alert('Por favor, para agendar la reunión debes seleccionar tanto la fecha como la hora. Si solo deseas enviar una consulta, deja ambos campos de la agenda vacíos.');
                return;
            }

            // 3. Caso: Quiere agendar y enviar mensaje
            const monthYear = fechaStr.slice(0, 7); // Extraer YYYY-MM

            // Validar límite en localStorage
            let meetings = JSON.parse(localStorage.getItem('galo_meetings')) || [];
            
            // Chequear si el usuario ya agendó en este mismo mes
            const alreadyScheduled = meetings.find(m => m.email === email && m.monthYear === monthYear);

            if (alreadyScheduled) {
                alert('Ya tienes agendada una reunión para este mes con este correo. Solo se permite una por mes.');
                return; // Detener el envío
            }

            // Usar Date para manejar los cambios de hora y día correctamente (hora local)
            const startDate = new Date(`${fechaStr}T${horaStr}:00`);
            const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // Duración: 1 hora

            const formatGoogleDate = (d) => {
                return d.getFullYear().toString() + 
                       (d.getMonth() + 1).toString().padStart(2, '0') + 
                       d.getDate().toString().padStart(2, '0') + 'T' + 
                       d.getHours().toString().padStart(2, '0') + 
                       d.getMinutes().toString().padStart(2, '0') + '00';
            };

            const startDateTime = formatGoogleDate(startDate);
            const endDateTime = formatGoogleDate(endDate);

            const title = encodeURIComponent(`Primera Consulta - Galo y ${nombre}`);
            const details = encodeURIComponent(`Reunión agendada vía web.\nNombre: ${nombre}\nTeléfono: ${telefono}\nEmail: ${email}\n\nConsulta:\n${mensaje}\n\nPor favor, únete mediante Google Meet si decides agregar la videollamada.`);
            
            // Correos invitados: el cliente y Galo
            const addEmails = encodeURIComponent(`${email},contacto@galo.com`);

            // Generar URL de Google Calendar
            const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDateTime}/${endDateTime}&details=${details}&add=${addEmails}`;

            // Registrar reserva en localStorage
            meetings.push({ email: email, monthYear: monthYear });
            localStorage.setItem('galo_meetings', JSON.stringify(meetings));

            // Abrir Google Calendar en una nueva pestaña
            window.open(googleCalendarUrl, '_blank');

            // Mostrar mensaje de éxito y resetear formulario
            alert('¡Gracias! Se abrirá Google Calendar para que puedas guardar la cita. Al guardarla, Galo recibirá la invitación automáticamente.');
            formContacto.reset();
            if (warningLimit) warningLimit.style.display = 'none';
        });
    }
});
