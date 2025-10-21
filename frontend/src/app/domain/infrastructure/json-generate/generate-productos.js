// generate-productos.js
const fs = require("fs");
const path = require("path");

const dir = path.join(process.cwd(), "src/assets/data");

// Crea el directorio si no existe
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const categorias = [
  "Electrónica",
  "Ropa",
  "Hogar",
  "Juguetes",
  "Deportes",
  "Belleza",
  "Libros",
  "Alimentos",
  "Mascotas",
  "Automotriz"
];
const clusters = [0, 1, 2];

const productos = [];
const n = 250; // cantidad de productos

for (let i = 1; i <= n; i++) {
  const cluster = clusters[Math.floor(Math.random() * clusters.length)];
  const categoria = categorias[Math.floor(Math.random() * categorias.length)];

  // Rangos según cluster
  let precio, volumen, margen;
  if (cluster === 0) {
    // stock alto
    precio = +(1000 + Math.random() * 400).toFixed(0);
    volumen = Math.floor(400 + Math.random() * 200);
    margen = +(0.20 + Math.random() * 0.1).toFixed(2);
  } else if (cluster === 1) {
    // balanceado
    precio = +(1200 + Math.random() * 300).toFixed(0);
    volumen = Math.floor(200 + Math.random() * 100);
    margen = +(0.25 + Math.random() * 0.1).toFixed(2);
  } else {
    // margen bajo
    precio = +(900 + Math.random() * 200).toFixed(0);
    volumen = Math.floor(150 + Math.random() * 150);
    margen = +(0.10 + Math.random() * 0.05).toFixed(2);
  }

  // Ventas simuladas 6 meses
  const ventas = [];
  for (let m = 1; m <= 6; m++) {
    ventas.push({
      fecha: `2025-0${m}-01`,
      valor: Math.floor(volumen * (0.8 + Math.random() * 0.4)),
    });
  }

  productos.push({
    id: i,
    nombre: `Producto ${i}`,
    categoria,
    cluster,
    precio,
    volumen,
    margen,
    ventas,
  });
}

const filePath = path.join(dir, "productos.json");
fs.writeFileSync(filePath, JSON.stringify(productos, null, 2));
console.log("✅ Archivo productos.json generado con", n, "productos");
