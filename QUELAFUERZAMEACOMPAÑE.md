# ⚔️ Manual del Joven Padawan — Sequelize

> Joven padawan, escucha a tu maestro:
> **Ya has construido esta nave antes.** Tu proyecto ya funciona.
> Mañana no inventarás nada: **copiarás lo que ya sabes y cambiarás los nombres.**
> El miedo es el camino hacia el error de sintaxis. Respira. Sigue los pasos.

---

## 🌌 La primera lección

**Modelo nuevo = copiar la carpeta `brands`, cambiar los nombres y añadir el campo que lo une al otro modelo.**

Eso es todo. El resto son detalles.

---

## 🟢 PRUEBA 1 — Clonar la carpeta (las Guerras Clon, versión fácil)

1. Copia la carpeta `src/modules/brands`
2. Pégala y llámala como el modelo nuevo (ej: `reviews`)
3. Renombra los 4 archivos:
   - `brand.model.ts` → `review.model.ts`
   - `brand.service.ts` → `review.service.ts`
   - `brand.controller.ts` → `review.controller.ts`
   - `brand.routes.ts` → `review.routes.ts`
4. Dentro de cada archivo: **Buscar y reemplazar** (`Ctrl + H`) con mayúsculas activadas (`Aa`):
   - `Brand` → `Review`
   - `brand` → `review` *(esto cambia también `brands` → `reviews`)*

✅ **El CRUD ya está hecho.** Primera prueba superada, padawan.

---

## 🟢 PRUEBA 2 — Dar forma al modelo

En `review.model.ts` cada campo se escribe en **2 sitios**. No en 1. En 2.

**Arriba (en la clase):**
```ts
declare bicycleId: number;     // 👈 el campo que une con el otro modelo
declare rating: number;
declare comment: string;
```

**Abajo (en el `init`):**
```ts
bicycleId: {
  type: DataTypes.INTEGER.UNSIGNED,
  allowNull: false,
},
rating: {
  type: DataTypes.INTEGER,
  allowNull: false,
},
comment: {
  type: DataTypes.STRING(150),
  allowNull: false,
},
```

📜 **Los tipos del archivo Jedi:**
- número entero → `DataTypes.INTEGER`
- id / campo que une → `DataTypes.INTEGER.UNSIGNED`
- texto → `DataTypes.STRING(150)`
- precio → `DataTypes.DECIMAL(10, 2)`
- fecha → `DataTypes.DATE`

---

## 🟢 PRUEBA 3 — Unir los modelos con la Fuerza (`associations.ts`)

### ¿Qué relación te pide el maestro? Mira y copia:

| Te dicen… | Ya lo hiciste en… | Copias esto |
|---|---|---|
| **1:N** (uno tiene muchos) | Brand → Bicycle | `hasMany` + `belongsTo` |
| **1:1** (uno tiene uno) | Bicycle → BicycleDetail | `hasOne` + `belongsTo` |
| **N:M** (muchos con muchos) | Order ↔ Bicycle | `belongsToMany` x2 con tabla en medio |

### 1:N → "Una bici tiene muchas reviews"
*(como un maestro con muchos padawans)*
```ts
Bicycle.hasMany(Review, { foreignKey: "bicycleId", as: "reviews" });
Review.belongsTo(Bicycle, { foreignKey: "bicycleId", as: "bicycle" });
```

### 1:1 → "Una bici tiene una garantía"
*(como un Jedi y su sable: uno solo)*
```ts
Bicycle.hasOne(Warranty, { foreignKey: "bicycleId", as: "warranty" });
Warranty.belongsTo(Bicycle, { foreignKey: "bicycleId", as: "bicycle" });
```
*(en el modelo, al campo `bicycleId` añádele `unique: true`)*

### 🧘 Sabiduría del maestro
- El campo que une (`bicycleId`) va **siempre en el modelo "hijo"** (el padawan, el que hace `belongsTo`).
- El `as` es un **apodo**. Plural si son muchos (`reviews`), singular si es uno (`bicycle`).
- **Grábate el apodo.** Lo necesitarás en la consulta. Olvidarlo, al Lado Oscuro te lleva.

Importa arriba del archivo:
```ts
import { Review } from "../modules/reviews/review.model";
```

---

## 🟢 PRUEBA 4 — Registrar tu nave en la flota (2 líneas)

**`src/server.ts`** (junto a los otros imports):
```ts
import "./modules/reviews/review.model";
```

**`src/routes/index.ts`**:
```ts
import reviewRoutes from "../modules/reviews/review.routes";
router.use("/reviews", reviewRoutes);
```

👉 Arranca con `npm run dev`. Si no sale error rojo: **la Fuerza está contigo.**

---

## 🟢 PRUEBA 5 — La consulta (siempre son 3 piezas)

Una consulta **siempre** se escribe en 3 archivos, **siempre** en este orden:

### 🔹 Pieza 1: SERVICE (la consulta en sí)
```ts
static async findReviewsOfBicycle(bicycleId: number) {
  return Review.findAll({
    where: { bicycleId },                              // filtro
    include: [{ model: Bicycle, as: "bicycle" }],      // trae el otro modelo (con el APODO)
    order: [["rating", "DESC"]],                       // orden
  });
}
```
*(importa arriba: `import { Bicycle } from "../bicycles/bicycle.model";`)*

### 🔹 Pieza 2: CONTROLLER (coge el dato de la URL y llama al service)
```ts
static async getReviewsOfBicycle(req: Request, res: Response, next: NextFunction) {
  try {
    const bicycleId = Number(req.params.bicycleId);
    const reviews = await ReviewService.findReviewsOfBicycle(bicycleId);
    res.json(reviews);
  } catch (error) {
    next(error);
  }
}
```

### 🔹 Pieza 3: ROUTES (la URL)
```ts
router.get("/bicycle/:bicycleId", ReviewController.getReviewsOfBicycle);
```
⚠️ **Ponla ARRIBA**, justo después de `router.get("/", ...)`.

👉 Pruébala en Postman: `GET http://localhost:3000/api/reviews/bicycle/1`

---

## 🧩 Las piezas de la consulta (tu caja de herramientas Jedi)

Solo existen estas piezas. Combina las que te pida el maestro:

| Si el maestro dice… | Tú pones… |
|---|---|
| "con sus datos de X" / "ansiosa" / "eager" | `include: [{ model: X, as: "apodo" }]` |
| "de un id concreto" | `where: { bicycleId }` |
| "de mayor a menor" | `order: [["campo", "DESC"]]` |
| "de menor a mayor" | `order: [["campo", "ASC"]]` |
| "que contenga el texto…" | `where: { name: { [Op.like]: `%${texto}%` } }` |
| "mayor que…" | `where: { price: { [Op.gt]: numero } }` |
| "menor que…" | `where: { price: { [Op.lt]: numero } }` |
| "solo los que tengan X" (INNER JOIN) | añade `required: true` dentro del include |
| "solo mostrar algunos campos" | `attributes: ["id", "name"]` |

Si usas `Op`, impórtalo arriba: `import { Op } from "sequelize";`

---

## 📚 Los Archivos Jedi (tus consultas ya hechas)

Busca la que más se parezca a la que te pidan y **cópiala**:

| Lo que pide se parece a… | Abre este archivo |
|---|---|
| "Una cosa con los datos de su padre" | `bicycle.service.ts` → `findEagerlyById` |
| "Filtrar por un campo del otro modelo" | `bicycle.service.ts` → `findAllEagerlyByFrameMaterial` |
| "Las cosas de un id, ordenadas" | `order.service.ts` → `findByCustomerId` |
| "Buscar por texto (LIKE) + INNER JOIN" | `customer.service.ts` → `findCustomersWithOrdersByNameSearch` |

---

## 🔴 Señales del Lado Oscuro (si algo falla)

1. **"alias… does not match"** → el `as` de la consulta no es igual que el de `associations.ts`. Cópialo exacto, letra por letra.
2. **"is not associated"** → falta la relación en `associations.ts`, o el import en `server.ts`.
3. **"Route not found"** → falta el `router.use(...)` en `routes/index.ts`, o la URL está mal escrita.
4. **"foreign key constraint fails"** → estás creando un hijo de un padre que no existe. Crea primero el padre en Postman (los datos se borran cada vez que reinicias).

---

## ✅ Checklist del padawan (marca mientras haces el examen)

- [ ] Copié la carpeta `brands` y cambié los nombres
- [ ] Puse los campos en el modelo (arriba **y** abajo)
- [ ] Puse la relación en `associations.ts` (+ import)
- [ ] Import en `server.ts`
- [ ] `router.use` en `routes/index.ts`
- [ ] Arranca sin errores
- [ ] Consulta: service → controller → route
- [ ] Probado en Postman

---

## 🎯 Entrenamiento final: consultas que pueden caer en el examen

> Padawan, aquí tienes **10 consultas posibles**, todas con los modelos de tu proyecto, así que puedes probarlas esta noche.
> Cada una trae sus **3 piezas**: service, controller y route.
> Si el maestro te pide algo parecido con el modelo nuevo, **cambia solo los nombres**.

### 🧱 El controller es SIEMPRE igual

Para no repetirlo 10 veces, este es el molde. Solo cambias **3 cosas** (marcadas con 👈):

```ts
static async getLoQueSea(req: Request, res: Response, next: NextFunction) {   // 👈 1. nombre
  try {
    const dato = Number(req.params.dato);                                       // 👈 2. el dato de la URL
    const resultado = await XxxService.findLoQueSea(dato);                      // 👈 3. el método del service
    res.json(resultado);
  } catch (error) {
    next(error);
  }
}
```

- Si el dato de la URL es un **número** (id, precio, stock…) → `Number(req.params.loQueSea)`
- Si el dato es un **texto** (nombre, estado, material…) → `String(req.params.loQueSea)`
- El nombre después de `req.params.` debe ser **igual** que lo que pones después de `:` en la ruta.

---

### 1️⃣ Una marca con TODAS sus bicis (1:N, desde el lado "uno")

*"Muestra una marca concreta junto con todas sus bicicletas."*

**Service** (`brand.service.ts`):
```ts
static async findEagerlyById(id: number) {
  return Brand.findByPk(id, {
    include: [{ model: Bicycle, as: "bicycles" }],
  });
}
```
Import: `import { Bicycle } from "../bicycles/bicycle.model";`

**Route** (`brand.routes.ts`):
```ts
router.get("/eagerly/:id", BrandController.getEagerlyById);
```
🧪 Postman: `GET /api/brands/eagerly/1`

---

### 2️⃣ Bicis más caras que un precio, de la más cara a la más barata

*"Muestra las bicis con precio mayor que X, con su marca, ordenadas por precio descendente."*

**Service** (`bicycle.service.ts`):
```ts
static async findByPriceGreaterThan(price: number) {
  return Bicycle.findAll({
    where: { price: { [Op.gt]: price } },
    include: [{ model: Brand, as: "brand" }],
    order: [["price", "DESC"]],
  });
}
```
Import: `import { Op } from "sequelize";`

**Route**:
```ts
router.get("/price-greater/:price", BicycleController.getByPriceGreaterThan);
```
🧪 Postman: `GET /api/bicycles/price-greater/1000`

---

### 3️⃣ Bicis entre dos precios (dos datos en la URL)

*"Muestra las bicis cuyo precio esté entre un mínimo y un máximo."*

**Service**:
```ts
static async findByPriceBetween(min: number, max: number) {
  return Bicycle.findAll({
    where: { price: { [Op.between]: [min, max] } },
    order: [["price", "ASC"]],
  });
}
```

**Controller** (aquí son 2 datos):
```ts
const min = Number(req.params.min);
const max = Number(req.params.max);
const bicycles = await BicycleService.findByPriceBetween(min, max);
```

**Route**:
```ts
router.get("/price/:min/:max", BicycleController.getByPriceBetween);
```
🧪 Postman: `GET /api/bicycles/price/500/3000`

---

### 4️⃣ Bicis cuya marca contiene un texto (filtro en el otro modelo)

*"Muestra las bicis cuya marca contenga el texto 'orb'."*

**Service**:
```ts
static async findByBrandName(text: string) {
  return Bicycle.findAll({
    include: [{
      model: Brand,
      as: "brand",
      where: { name: { [Op.like]: `%${text}%` } },
      required: true,
    }],
  });
}
```
🧘 Fíjate: el `where` va **dentro** del include porque el filtro es sobre la **marca**, no sobre la bici.

**Route**:
```ts
router.get("/brand-search/:text", BicycleController.getByBrandName);
```
🧪 Postman: `GET /api/bicycles/brand-search/orb`

---

### 5️⃣ Bicis con poco stock y su detalle (1:1)

*"Muestra las bicis con stock menor que X, con sus detalles."*

**Service**:
```ts
static async findLowStock(stock: number) {
  return Bicycle.findAll({
    where: { stock: { [Op.lt]: stock } },
    include: [{ model: BicycleDetail, as: "detail" }],
    order: [["stock", "ASC"]],
  });
}
```

**Route**:
```ts
router.get("/low-stock/:stock", BicycleController.getLowStock);
```
🧪 Postman: `GET /api/bicycles/low-stock/5`

---

### 6️⃣ Pedidos con un estado concreto y su cliente

*"Muestra los pedidos con estado 'paid', con el nombre y email del cliente, del más reciente al más antiguo."*

**Service** (`order.service.ts`):
```ts
static async findByStatus(status: string) {
  return Order.findAll({
    where: { status },
    include: [{ model: Customer, as: "customer", attributes: ["name", "email"] }],
    order: [["orderDate", "DESC"]],
  });
}
```

**Controller**: aquí el dato es texto → `const status = String(req.params.status);`

**Route**:
```ts
router.get("/status/:status", OrderController.getByStatus);
```
🧪 Postman: `GET /api/orders/status/paid`
*(estados válidos: `pending`, `paid`, `shipped`, `cancelled`)*

---

### 7️⃣ Un cliente con todos sus pedidos

*"Muestra un cliente concreto con todos sus pedidos."*

**Service** (`customer.service.ts`):
```ts
static async findEagerlyById(id: number) {
  return Customer.findByPk(id, {
    include: [{ model: Order, as: "orders" }],
  });
}
```

**Route**:
```ts
router.get("/eagerly/:id", CustomerController.getEagerlyById);
```
🧪 Postman: `GET /api/customers/eagerly/1`

---

### 8️⃣ Un pedido con todas sus bicis (N:M)

*"Muestra un pedido con las bicis que contiene, con la cantidad y el precio de cada una."*

**Service** (`order.service.ts`):
```ts
static async findWithBicycles(id: number) {
  return Order.findByPk(id, {
    include: [{
      model: Bicycle,
      as: "bicycles",
      attributes: ["id", "model", "price"],
      through: { attributes: ["quantity", "unitPrice"] },
    }],
  });
}
```
Import: `import { Bicycle } from "../bicycles/bicycle.model";`

🧘 `through` es la **tabla del medio** (OrderItem). Con `attributes` eliges qué columnas suyas mostrar. Si no quieres ver ninguna: `through: { attributes: [] }`.

**Route**:
```ts
router.get("/with-bicycles/:id", OrderController.getWithBicycles);
```
🧪 Postman: `GET /api/orders/with-bicycles/1`

---

### 9️⃣ Una bici con todos los pedidos donde aparece (N:M, al revés)

*"Muestra una bici y en qué pedidos se ha vendido."*

**Service** (`bicycle.service.ts`):
```ts
static async findWithOrders(id: number) {
  return Bicycle.findByPk(id, {
    include: [{
      model: Order,
      as: "orders",
      through: { attributes: [] },
    }],
  });
}
```
Import: `import { Order } from "../orders/order.model";`

**Route**:
```ts
router.get("/with-orders/:id", BicycleController.getWithOrders);
```
🧪 Postman: `GET /api/bicycles/with-orders/1`

---

### 🔟 Nivel Maestro Jedi: include dentro de include

*"Muestra un cliente con sus pedidos, y cada pedido con sus bicis."*

**Service** (`customer.service.ts`):
```ts
static async findWithOrdersAndBicycles(id: number) {
  return Customer.findByPk(id, {
    include: [{
      model: Order,
      as: "orders",
      include: [{
        model: Bicycle,
        as: "bicycles",
        through: { attributes: [] },
      }],
    }],
  });
}
```
Imports: `Order` y `Bicycle`.

🧘 Es como las muñecas rusas: un `include` **dentro** de otro `include`.

**Route**:
```ts
router.get("/full/:id", CustomerController.getWithOrdersAndBicycles);
```
🧪 Postman: `GET /api/customers/full/1`

---

### 🗺️ Mapa rápido: ¿qué consulta copio?

| El maestro dice… | Copia la nº |
|---|---|
| "X con todos sus Y" | 1️⃣ o 7️⃣ |
| "mayor que / menor que" | 2️⃣ o 5️⃣ |
| "entre … y …" | 3️⃣ |
| "que contenga el texto" (en el otro modelo) | 4️⃣ |
| "que contenga el texto" (en el mismo modelo) | la de `customer.service.ts` de tu proyecto |
| "con estado / tipo / categoría igual a…" | 6️⃣ |
| "muchos a muchos" / tabla intermedia | 8️⃣ o 9️⃣ |
| "X con sus Y, y cada Y con sus Z" | 🔟 |

### ⚠️ Antes de probar cada consulta, revisa estas 3 cosas

1. ¿Importé el modelo que uso en el `include` (y `Op` si lo uso)?
2. ¿El `as` es **exactamente** el de `associations.ts`?
3. ¿Puse la ruta **arriba**, antes de `router.get("/:id", ...)`?

---

## 📮 Los BODY para Postman (los POST)

### 🛠️ Cómo se pone el body en Postman

1. Elige **POST** en el desplegable (a la izquierda de la URL)
2. Escribe la URL (ej: `http://localhost:3000/api/brands`)
3. Pestaña **Body** → marca **raw** → en el desplegable de la derecha elige **JSON**
4. Pega el JSON y pulsa **Send**
5. Si sale **201 Created** → ✅ creado

### ⚠️ La regla del orden (muy importante, padawan)

**Primero los padres, después los hijos.** No puedes crear una bici de una marca que no existe.
Y recuerda: **cada vez que reinicias el servidor se borran los datos** (`sync({ force: true })`), así que hay que volver a crearlos.

```
Brand → Bicycle → BicycleDetail → Customer → Order → OrderItem
```

---

### 1. Marcas → `POST http://localhost:3000/api/brands`

Envía cada uno por separado (uno, Send, el siguiente, Send…):
```json
{ "name": "Orbea" }
```
```json
{ "name": "Specialized" }
```
```json
{ "name": "Trek" }
```
*(quedan con id 1, 2 y 3)*

---

### 2. Bicis → `POST http://localhost:3000/api/bicycles`

Obligatorios: `brandId`, `model`, `price`
```json
{ "brandId": 1, "model": "Orca M30", "description": "Bici de carretera", "price": 2500, "stock": 3 }
```
```json
{ "brandId": 1, "model": "Rise H20", "description": "Bici eléctrica", "price": 4200, "stock": 1 }
```
```json
{ "brandId": 2, "model": "Rockhopper", "description": "Bici de montaña", "price": 800, "stock": 10 }
```
```json
{ "brandId": 3, "model": "Marlin 5", "description": "Bici de montaña barata", "price": 550, "stock": 2 }
```
*(quedan con id 1, 2, 3 y 4)*

---

### 3. Detalles de bici → `POST http://localhost:3000/api/bicycle-details`

Obligatorios: `bicycleId`, `frameMaterial`, `wheelSize`, `weight`
⚠️ Solo **un detalle por bici** (es 1:1). `frameMaterial` solo puede ser: `Aluminum`, `Carbon`, `Steel`, `Titanium`.
```json
{ "bicycleId": 1, "frameMaterial": "Carbon", "wheelSize": 28, "weight": 7.9, "suspension": "None" }
```
```json
{ "bicycleId": 2, "frameMaterial": "Aluminum", "wheelSize": 29, "weight": 22.5, "suspension": "Front" }
```
```json
{ "bicycleId": 3, "frameMaterial": "Aluminum", "wheelSize": 29, "weight": 13.8, "suspension": "Front" }
```
```json
{ "bicycleId": 4, "frameMaterial": "Steel", "wheelSize": 27.5, "weight": 14.2 }
```

---

### 4. Clientes → `POST http://localhost:3000/api/customers`

Obligatorios: `name`, `email` (los dos **no se pueden repetir**)
```json
{ "name": "Chewbacca", "email": "chewie@kashyyyk.com" }
```
```json
{ "name": "Luke Skywalker", "email": "luke@tatooine.com" }
```
```json
{ "name": "Leia Organa", "email": "leia@alderaan.com" }
```
*(quedan con id 1, 2 y 3. Para la búsqueda por texto prueba `/api/customers/chew/orders`)*

---

### 5. Pedidos → `POST http://localhost:3000/api/orders`

Obligatorios: `customerId`, `orderDate`, `status`
`status` solo puede ser: `pending`, `paid`, `shipped`, `cancelled`
```json
{ "customerId": 1, "orderDate": "2026-09-15", "status": "paid" }
```
```json
{ "customerId": 1, "orderDate": "2026-10-01", "status": "pending" }
```
```json
{ "customerId": 2, "orderDate": "2026-09-20", "status": "shipped" }
```
*(quedan con id 1, 2 y 3. Leia no tiene pedidos → útil para ver la diferencia entre LEFT JOIN e INNER JOIN con `required: true`)*

---

### 6. Líneas de pedido (tabla N:M) → `POST http://localhost:3000/api/order-items`

Obligatorios: `orderId`, `bicycleId`, `quantity` (mínimo 1), `unitPrice`
```json
{ "orderId": 1, "bicycleId": 1, "quantity": 1, "unitPrice": 2500 }
```
```json
{ "orderId": 1, "bicycleId": 3, "quantity": 2, "unitPrice": 800 }
```
```json
{ "orderId": 2, "bicycleId": 2, "quantity": 1, "unitPrice": 4200 }
```
```json
{ "orderId": 3, "bicycleId": 1, "quantity": 1, "unitPrice": 2400 }
```

---

### 7. El modelo nuevo del examen (ejemplo `Review`) → `POST http://localhost:3000/api/reviews`

El body lleva **los campos que pusiste en el modelo** (menos `id`, `createdAt` y `updatedAt`, que se ponen solos):
```json
{ "bicycleId": 1, "rating": 5, "comment": "Vuela como un caza X" }
```
```json
{ "bicycleId": 1, "rating": 3, "comment": "Cara pero buena" }
```
```json
{ "bicycleId": 3, "rating": 4, "comment": "Perfecta para el monte" }
```

🧘 **Truco del maestro:** el body son **los mismos nombres** que pusiste en `const { ... } = req.body;` del controller `create`. Si no coinciden, te sale el **400** de "son obligatorios".

---

### ✏️ Y para editar (PUT) y borrar (DELETE)

**PUT** `http://localhost:3000/api/bicycles/1` → solo mandas lo que cambias:
```json
{ "price": 2300, "stock": 5 }
```

**DELETE** `http://localhost:3000/api/bicycles/4` → **sin body**. Si sale **204 No Content** → ✅ borrado.

---

### 🚦 Qué significa cada respuesta

| Código | Significado |
|---|---|
| **200** | Todo bien (GET / PUT) |
| **201** | Creado (POST) ✅ |
| **204** | Borrado (DELETE) ✅ |
| **400** | Falta un campo obligatorio en el body |
| **404** | No existe ese id, o la ruta está mal escrita |
| **500** | Error del servidor → mira la **terminal** de VS Code, ahí sale el error real (alias mal, FK que no existe, valor de ENUM inválido…) |

---

> 🧘 **Palabras finales del maestro:**
> No eres tonto, padawan. Estás nervioso, y es distinto.
> Ya lo hiciste una vez y funcionó. Mañana solo lo repites con otros nombres.
> **Hazlo o no lo hagas, pero no lo intentes con miedo.**
> Que la Fuerza (y `Ctrl + C`, `Ctrl + V`) te acompañen. ⚔️