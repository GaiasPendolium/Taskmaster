// Manejo del formulario de registro
const signupForm = document.getElementById('signupForm');

if (signupForm) {

    signupForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Evitar el envío tradicional del formulario

        const formData = new FormData(signupForm);
        const nombre = formData.get('nombre');
        const email = formData.get('email');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');

        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }

        try {
            const response = await fetch('signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nombre, email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                alert(data.message); // Muestra un mensaje de éxito
                signupForm.reset(); // Limpia el formulario después del envío exitoso
            } else {
                throw new Error('Error en el servidor');
            }
        } catch (error) {
            console.error('Error al procesar la solicitud de registro:', error);
            alert('Hubo un error al procesar la solicitud');
        }
    });
} else {
    console.error('El elemento signupForm no fue encontrado en el DOM.');

}

// Manejo del formulario de inicio de sesión
const signinForm = document.getElementById('signinForm');

signinForm.addEventListener('submit', async (event) => {
  event.preventDefault(); // Evitar el envío tradicional del formulario

  const formData = new FormData(signinForm);
  const email = formData.get('email');
  const password = formData.get('password');

  try {
    const response = await fetch('/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      alert(data.message); // Muestra un mensaje de éxito
      signinForm.reset(); // Limpia el formulario después del inicio de sesión exitoso
    } else {
      throw new Error('Error en el servidor');
    }
  } catch (error) {
    console.error('Error al procesar la solicitud de inicio de sesión:', error);
    alert('Hubo un error al procesar la solicitud');
  }
});
