# 🧠 Proyecto de Predicción de Estrés y Dashboard Analítico

Este repositorio contiene dos interfaces de usuario (**UI**) desarrolladas en **Angular**, cada una enfocada en un propósito distinto dentro del proyecto general de análisis y visualización de datos médicos y de negocio.

---

## 🚀 Estructura del Repositorio

### 🩺 **Rama `main`**
Interfaz principal relacionada con la **predicción del nivel de estrés** a partir de variables médicas.

- Desarrollada en **Angular**
- Conectada a un **API backend** (modelo predictivo y servicios REST)
- Permite la **entrada de datos médicos** y muestra los **resultados de predicción**
- Usa componentes modulares y un flujo de navegación enfocado en la evaluación individual

**Características principales:**
- Integración con API para obtener resultados en tiempo real  
- Formularios dinámicos de ingreso de datos médicos  
- Resultados interpretables con indicadores visuales  

---

### 📊 **Rama `machine-learning`**
Interfaz alternativa enfocada en un **dashboard analítico** con base en datos simulados.

- UI desarrollada también en **Angular**
- **No consume API**, trabaja con un **JSON local de ejemplo** (`assets/data/productos.json`)
- Incluye **gráficas, filtros, KPIs y alertas automáticas**

**Componentes incluidos:**
- **Gráfico de burbujas:** Precio vs Volumen, colores por *cluster*  
- **Gráfico de barras:** Ventas por categoría  
- **Gráfico de línea:** Evolución de ventas en el tiempo  
- **Tabla de alertas:** Genera advertencias automáticas como:  
  - “Cluster 0: Stock muy alto - Reducir inventario”  
  - “Cluster 2: Margen bajo - Revisar precios”  

---

## ⚙️ Instalación y Ejecución

1. **Clonar el repositorio:**
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd <nombre-del-repositorio>
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Ejecutar el servidor de desarrollo:**
   ```bash
   ng serve
   ```

4. **Abrir en el navegador:**
   ```
   http://localhost:4200/
   ```

---

## 🔄 Cambiar entre ramas

### Rama principal (predicción de estrés)
```bash
git checkout main
```

### Rama de dashboard (análisis con JSON)
```bash
git checkout machine-learning
```

---

## 📁 Estructura general

```
public/
  ├── assets/
  │   └── data/
  │       └── productos.json  ← Datos de ejemplo (solo en machine-learning)
src/
 ├── app/
 │   ├── domain/
 │   ├── ui/
 └── environments/
```
---

## 🧩 Tecnologías utilizadas

- **Angular 19**
- **FastAPI**
- **ng2-charts / Chart.js**
- **TypeScript**
- **RxJS**
- **Bootstrap / Tailwind (opcional según rama)**
- **JSON local para simulación de datos**

---

## 🧑‍💻 Autor

**Andrés Rey**  
Proyecto académico - 8° semestre  
Universidad Sergio Arboleda

---

## 📛 Licencia

Este proyecto es de uso académico y puede ser reutilizado con fines educativos o de investigación.

---

![Angular](https://img.shields.io/badge/Angular-19-red?logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?logo=typescript)
![Chart.js](https://img.shields.io/badge/Charts-ng2--charts%20%7C%20Chart.js-orange)
![Branch main](https://img.shields.io/badge/branch-main-blue)
![Branch machine-learning](https://img.shields.io/badge/branch-machine--learning-green)
