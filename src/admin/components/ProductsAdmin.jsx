
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase.js";


const labelStyle = {
  display: "block",
  color: "#542d3b",
  fontWeight: "600",
  marginBottom: "9px",
  fontSize: "14px",
};

const inputStyle = {
  display: "block",
  width: "100%",
  boxSizing: "border-box",
  padding: "13px 15px",
  border: "1px solid #e5d5dc",
  borderRadius: "12px",
  background: "#fffdfd",
  color: "#342b2b",
  fontSize: "15px",
  fontFamily: "inherit",
};


const emptyProduct = {
  name: "",
  price: "",
  type: "no-personalizable",
  category: "No personalizable",
  description: "",
  image: "",
  available: true,
};

function ProductsAdmin() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [product, setProduct] = useState(emptyProduct);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadProducts() {
    setLoading(true);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setProducts(data ?? []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setProduct((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function resetForm() {
    setProduct(emptyProduct);
    setEditingId(null);
    setShowForm(false);
    setError("");
    setSuccess("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    const price = Number(product.price);

    if (!Number.isFinite(price) || price < 0) {
      setError("El precio debe ser un número igual o mayor que cero.");
      setSaving(false);
      return;
    }

    const payload = {
      name: product.name.trim(),
      price,
      type: product.type,
      category: product.category,
      description: product.description.trim() || null,
      image: product.image.trim() || null,
      available: product.available,
    };

    const result =
      editingId !== null
        ? await supabase
            .from("products")
            .update(payload)
            .eq("id", editingId)
            .select()
        : await supabase
            .from("products")
            .insert(payload)
            .select();

    if (result.error) {
      setError(result.error.message);
      setSaving(false);
      return;
    }

    await loadProducts();
    setProduct(emptyProduct);
    setEditingId(null);
    setShowForm(false);
    setSuccess(
      editingId !== null
        ? "Producto actualizado correctamente."
        : "Producto guardado correctamente."
    );
    setSaving(false);
  }

  function handleEdit(item) {
    setProduct({
      name: item.name ?? "",
      price: String(item.price ?? ""),
      type: item.type ?? "no-personalizable",
      category: item.category ?? "No personalizable",
      description: item.description ?? "",
      image: item.image ?? "",
      available: item.available ?? true,
    });

    setEditingId(item.id);
    setShowForm(true);
    setError("");
    setSuccess("");
  }

  async function handleDelete(id) {
    if (!window.confirm("¿Seguro que quieres eliminar este producto?")) {
      return;
    }

    setError("");
    setSuccess("");

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      setError(error.message);
      return;
    }

    setSuccess("Producto eliminado correctamente.");
    await loadProducts();
  }

    const filteredProducts = products.filter((item) => {
    const search = searchTerm.trim().toLowerCase();

    return (
      (item.name ?? "").toLowerCase().includes(search) ||
      (item.category ?? "").toLowerCase().includes(search) ||
      (item.type ?? "").toLowerCase().includes(search)
    );
  });

  return (
    <main>
      <h1>Productos</h1>

      {error && (
        <p role="alert" style={{ color: "crimson" }}>
          {error}
        </p>
      )}

      {success && (
        <p role="status" style={{ color: "green" }}>
          {success}
        </p>
      )}

      
<button
  type="button"
  onClick={() => {
    resetForm();
    setShowForm(true);
  }}
  style={{
    background: "#542d3b",
    color: "#ffffff",
    border: "none",
    borderRadius: "999px",
    padding: "12px 24px",
    fontWeight: "600",
    fontSize: "15px",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(84, 45, 59, 0.15)",
  }}
>
  + Agregar producto
</button>


      
{showForm && (
  <section
    style={{
      background: "#ffffff",
      border: "1px solid #eee2e5",
      borderRadius: "24px",
      padding: "32px",
      marginTop: "24px",
      marginBottom: "32px",
      maxWidth: "760px",
      width: "100%",
      boxSizing: "border-box",
      boxShadow: "0 12px 35px rgba(84, 45, 59, 0.08)",
    }}
  >
   
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "16px",
        marginBottom: "28px",
      }}
    >
      <div>
        <h2
          style={{
            color: "#542d3b",
            fontSize: "26px",
            margin: "0 0 8px",
          }}
        >
          {editingId !== null ? "Editar producto" : "Nuevo producto"}
        </h2>
        <p style={{ color: "#897a7e", margin: 0, lineHeight: "1.5" }}>
          Completa los datos para agregar un artículo al catálogo.
        </p>
      </div>

      <button
        type="button"
        onClick={resetForm}
        aria-label="Cerrar formulario"
        title="Cerrar"
        style={{
          flexShrink: 0,
          width: "38px",
          height: "38px",
          border: "none",
          borderRadius: "50%",
          background: "#f8e8ee",
          color: "#542d3b",
          fontSize: "25px",
          lineHeight: 1,
          cursor: "pointer",
        }}
      >
        ×
      </button>
    </div>


    <form onSubmit={handleSubmit}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
        }}
      >
        <div style={{ gridColumn: "1 / -1" }}>
          <label htmlFor="product-name" style={labelStyle}>
            Nombre del producto
          </label>
          <input
            id="product-name"
            name="name"
            value={product.name}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="product-price" style={labelStyle}>
            Precio en colones (₡)
          </label>
          <input
            id="product-price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={product.price}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="product-type" style={labelStyle}>
            Tipo de producto
          </label>
          <select
            id="product-type"
            name="type"
            value={product.type}
            onChange={handleChange}
            required
            style={inputStyle}
          >
            <option value="personalizable">Personalizable</option>
            <option value="no-personalizable">No personalizable</option>
          </select>
        </div>

        <div style={{ gridColumn: "1 / -1" }}>
          <label htmlFor="product-category" style={labelStyle}>
            Categoría
          </label>
          <select
            id="product-category"
            name="category"
            value={product.category}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="No personalizable">No personalizable</option>
            <option value="Personalizable">Personalizable</option>
          </select>
        </div>

        <div style={{ gridColumn: "1 / -1" }}>
          <label htmlFor="product-description" style={labelStyle}>
            Descripción
          </label>
          <textarea
            id="product-description"
            name="description"
            value={product.description}
            onChange={handleChange}
            rows="4"
            style={{ ...inputStyle, resize: "vertical" }}
          />
        </div>

        <div style={{ gridColumn: "1 / -1" }}>
          <label htmlFor="product-image" style={labelStyle}>
            URL de la imagen
          </label>
          <input
            id="product-image"
            name="image"
            type="url"
            value={product.image}
            onChange={handleChange}
            placeholder="https://..."
            style={inputStyle}
          />
        </div>
      </div>

      {product.image && (
        <div style={{ marginTop: "20px" }}>
          <img
            src={product.image}
            alt="Vista previa del producto"
            style={{
              width: "180px",
              height: "180px",
              objectFit: "contain",
              borderRadius: "16px",
              border: "1px solid #eee2e5",
              padding: "8px",
              background: "#fbf8f6",
            }}
          />
        </div>
      )}

      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginTop: "24px",
          color: "#542d3b",
          fontWeight: "600",
        }}
      >
        <input
          type="checkbox"
          name="available"
          checked={product.available}
          onChange={handleChange}
        />
        Producto disponible
      </label>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          marginTop: "30px",
          paddingTop: "24px",
          borderTop: "1px solid #eee2e5",
        }}
      >
        <button
          type="submit"
          disabled={saving}
          style={{
            background: "#542d3b",
            color: "#ffffff",
            border: "none",
            borderRadius: "999px",
            padding: "13px 26px",
            fontWeight: "600",
            cursor: saving ? "not-allowed" : "pointer",
            opacity: saving ? 0.7 : 1,
          }}
        >
          {saving
            ? "Guardando..."
            : editingId !== null
              ? "Guardar cambios"
              : "Guardar producto"}
        </button>

        <button
          type="button"
          onClick={resetForm}
          style={{
            background: "#f5e7ec",
            color: "#542d3b",
            border: "1px solid #ead1da",
            borderRadius: "999px",
            padding: "13px 26px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Cancelar
        </button>
      </div>
    </form>
  </section>
)}


      
      <section
        style={{
          marginTop: "36px",
          padding: "28px",
          background: "#fffdfb",
          border: "1px solid #eee2e5",
          borderRadius: "24px",
          boxShadow: "0 8px 24px rgba(84, 45, 59, 0.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
            marginBottom: "22px",
          }}
        >
          <div>
            <h2 style={{ color: "#542d3b", margin: "0 0 8px" }}>
              Lista de productos
            </h2>
            <p style={{ color: "#897780", margin: 0 }}>
              Organiza y encuentra tus productos fácilmente.
            </p>
          </div>

          <span
            style={{
              padding: "9px 16px",
              borderRadius: "999px",
              background: "#f8e8ee",
              color: "#542d3b",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            {filteredProducts.length} productos
          </span>
        </div>

     
        <div
          style={{
            position: "relative",
            width: "100%",
            marginBottom: "26px",
          }}
        >
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Buscar por nombre, categoría o tipo..."
            aria-label="Buscar productos"
            style={{
              ...inputStyle,
              width: "100%",
              boxSizing: "border-box",
              borderRadius: "999px",
              padding: "14px 48px 14px 20px",
            }}
          />

          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              aria-label="Limpiar búsqueda"
              title="Limpiar búsqueda"
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                width: "30px",
                height: "30px",
                border: "none",
                borderRadius: "50%",
                background: "#f8e8ee",
                color: "#542d3b",
                fontSize: "21px",
                lineHeight: 1,
                cursor: "pointer",
              }}
            >
              ×
            </button>
          )}
        </div>


        {loading ? (
          <p style={{ color: "#897780" }}>Cargando productos...</p>
        ) : products.length === 0 ? (
          <p style={{ color: "#897780" }}>
            Aún no hay productos registrados.
          </p>
        ) : filteredProducts.length === 0 ? (
          <p style={{ color: "#897780" }}>
            No encontramos productos con esa búsqueda.
          </p>
        ) : (
          <div
            className="products-grid"
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 230px), 1fr))",
    gap: "22px",
    alignItems: "stretch",
  }}
          >
            {filteredProducts.map((item) => (
              <article
                className="product-card"
                key={item.id}
                style={{
                  overflow: "hidden",
                  border: "1px solid #eee2e5",
                  borderRadius: "20px",
                  background: "#ffffff",
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <div
                className="product-card-image"
                  style={{
                    height: "190px",
                    borderRadius: "14px",
                    background: "#faf3f5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  ) : (
                    <span style={{ color: "#a18b94", fontSize: "14px" }}>
                      Sin imagen
                    </span>
                  )}
                </div>

                <div>
                  <h3
                    style={{
                      color: "#542d3b",
                      fontSize: "18px",
                      margin: "4px 0 8px",
                    }}
                  >
                    {item.name}
                  </h3>

                  <p
                    style={{
                      color: "#897780",
                      fontSize: "13px",
                      margin: "0 0 8px",
                    }}
                  >
                    {item.category || "Sin categoría"}
                  </p>

                  <p
                    style={{
                      color: "#542d3b",
                      fontSize: "20px",
                      fontWeight: "700",
                      margin: "0 0 10px",
                    }}
                  >
                    {Number(item.price).toLocaleString("es-CR", {
                      style: "currency",
                      currency: "CRC",
                    })}
                  </p>

                  <span
                    style={{
                      display: "inline-block",
                      padding: "6px 11px",
                      borderRadius: "999px",
                      background: item.available ? "#e8f4ec" : "#f8e8ee",
                      color: item.available ? "#356747" : "#8a4057",
                      fontSize: "12px",
                      fontWeight: "600",
                    }}
                  >
                    {item.available ? "Disponible" : "No disponible"}
                  </span>
                </div>

                {item.description && (
                  <p
                    style={{
                      color: "#76666d",
                      fontSize: "13px",
                      lineHeight: "1.5",
                      margin: 0,
                    }}
                  >
                    {item.description}
                  </p>
                )}

                <p style={{ color: "#897780", fontSize: "13px", margin: 0 }}>
                  Tipo:{" "}
                  {item.type === "personalizable"
                    ? "Personalizable"
                    : "No personalizable"}
                </p>

                <div
                  className="product-card-actions"
                  style={{
                    display: "flex",
                    gap: "8px",
                    marginTop: "auto",
                    paddingTop: "8px",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => handleEdit(item)}
                    style={{
                      flex: 1,
                      padding: "10px 14px",
                      border: "none",
                      borderRadius: "999px",
                      background: "#f3d6e1",
                      color: "#542d3b",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    style={{
                      flex: 1,
                      padding: "10px 14px",
                      border: "1px solid #e8bdcd",
                      borderRadius: "999px",
                      background: "#ffffff",
                      color: "#8a4057",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    Eliminar
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

    </main>
  );
}

export default ProductsAdmin;
