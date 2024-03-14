# eva-crm-front
Repositorio del código de Front para evaluación técnica

# Importante: pasos a seguir para tener listo el ambiente para el front

- Instalar nodejs            - Version ->
- Instalar angular           - Version ->
- Instalar angular-cli       - Version ->
- Ejecutar el comando `npm i` o `npm install`
- Apuntar el cliente a servidor local
  - Abrir el archivo **`proxy.conf.js`** de la carpeta **`webpack`**
  - identificar la linea **`target: http${tls ? 's' : ''}://localhost:5102/api`** y cambiamos el puerto `5102` por el puerto del api del backend
  - Abrimos el archivo `environments.ts` de la carpeta **`src > main > webapp > environments`** y cambiamos el puerto `5102` por el puerto que pusimos en el paso anterior
- Ejecutar el comando `npm start`

# Usuarios
- user: `admin`       password: `admin` 
- user: `promotor`   password: `promotor00`
- user: `evaluador`   password: `evaluador00`
