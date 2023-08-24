const txtCorreoUsuario = document.querySelector("#txtCorreoUsuario");
const txtPassword = document.querySelector("#txtPassword");
const eye_show = document.querySelector("#eye-show");
const eye_hide = document.querySelector("#eye-hide");

let Ifacebook = "",
  Itwitter = "",
  Iinstragram = "";
eye_show.onclick = () => {
  if (txtPassword.type === "password") {
    txtPassword.type = "text";
    eye_show.classList.replace("show", "hide");
    eye_hide.classList.replace("hide", "show");
  }
};

eye_hide.onclick = () => {
  if (txtPassword.type === "text") {
    txtPassword.type = "password";
    eye_show.classList.replace("hide", "show");
    eye_hide.classList.replace("show", "hide");
  }
};

let verificar_input = {
  txtCorreoUsuario: true,
  txtPassword: true,
};

document.querySelector("#accion").addEventListener("click", (e) => {
  e.preventDefault();
  validarInput();
});

let timerInterval;
function validarInput() {
  submitController();
}

function ValidacionLogin(icono, color, mensaje) {
  const Toast = Swal.mixin({
    toast: true,
    position: "bottom-end",
    showConfirmButton: false,
    iconColor: color,
    timer: 1000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  Toast.fire({
    icon: icono,
    title:
      "<h5 style='color:" + color + "; font-size:15px;' >" + mensaje + "</h5>",
  }).then(function () {
    // window.location.replace("Modulos?modulo=dashboard");
  });
}

txtCorreoUsuario.addEventListener("input", (e) => validatefieldWhite(e));
txtPassword.addEventListener("input", (e) => validatefieldWhite(e));

const validatefieldWhite = (e) => {
  const field = e.target;
  const fieldValue = e.target.value;
  const field_id = e.target.id;
  if (fieldValue.trim().length === 0) {
    verificar_input[field_id] = true;
  } else {
    verificar_input[field_id] = false;
  }
};

submitController = () => {
  if (verificar_input.txtCorreoUsuario || verificar_input.txtPassword) {
    ValidacionLogin("warning", "#FF0000", "Por favor llenar los campos*");
  } else {
    Swal.fire({
      title: '<h5 style="color:#08bb40; " >Confirmando su identidad...</h5>',
      html: "Enviando datos en <b></b>.",
      timer: 1500,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
        const b = Swal.getHtmlContainer().querySelector("b");
        timerInterval = setInterval(() => {
          b.textContent = Swal.getTimerLeft();
        }, 100);
      },
      willClose: () => {
        clearInterval(timerInterval);
      },
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.timer) {
        EnviarData();
        //    ValidacionLogin("success", "#08bb40", "Hola Guerrero!!");
        // location.href = "https://matias.ma/nsfw/";
      }
    });
  }
};

let frmModPass = $("#frm_login");

function EnviarData() {
  $.ajax({
    type: frmModPass.attr("method"),
    url: "/autenticarse",
    data: frmModPass.serialize(),
    success: function (response) {
      const respuesta = JSON.parse(response);
      console.log(response);
      console.log(respuesta.mensaje);
      // let error = data;
      if (respuesta.estado == 0) {
        const Toast = Swal.mixin({
          toast: true,
          position: "bottom-end",
          showConfirmButton: false,
          iconColor: "#ff0e1d",
          timer: 2000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener("mouseenter", Swal.stopTimer);
            toast.addEventListener("mouseleave", Swal.resumeTimer);
          },
        });

        Toast.fire({
          icon: "warning",
          title:
            "<h5 style='color:#8b0000; font-size:15px;'>Vaya, ha ocurrido un error</h5>",
        });
      } else {
        const Toast = Swal.mixin({
          toast: true,
          position: "bottom-end",
          showConfirmButton: false,
          iconColor: "#08bb40",
          timer: 2000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener("mouseenter", Swal.stopTimer);
            toast.addEventListener("mouseleave", Swal.resumeTimer);
          },
        });

        Toast.fire({
          icon: "success",
          title:
            "<h5 style='color:#006400; font-size:15px;' >Nueva contraseña agregada</h5>",
        }).then(function () {
           window.location.replace("/dashboard");
         // alert("Ha entrado");
        });
      }
    },
    error: function (error) {
      alert(error);
    },
  });
}
