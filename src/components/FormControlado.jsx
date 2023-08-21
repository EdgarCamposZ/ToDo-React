import { useState } from "react";

const Controlado = () => {
    // Estado para almacenar la lista de tareas
    const [todos, setTodos] = useState(() => {
        // Recuperar la lista de tareas del localStorage o un array vacío si no hay datos
        const storedTodos = JSON.parse(localStorage.getItem("todos")) || [];
        return storedTodos;
    });

    // Estado para almacenar los valores del nuevo elemento de la lista de tareas
    const [nuevoTodo, setNuevoTodo] = useState({
        todoNombre: "",
        todoDescripcion: "",
        todoEstado: "pendiente",
    });

    // Estado para almacenar el ID del elemento que se está editando actualmente
    const [editingId, setEditingId] = useState(null);

    // Manejador de cambio de valor en los campos de entrada del formulario
    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setNuevoTodo((prevTodo) => ({ ...prevTodo, [name]: value }));
    };

    // Manejador de envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();
        if (nuevoTodo.todoNombre && nuevoTodo.todoDescripcion) {
            if (editingId !== null) {
                // Actualizar el elemento correspondiente en la lista de tareas
                const updatedTodos = todos.map((todo) =>
                    todo.id === editingId ? { ...nuevoTodo, id: editingId } : todo
                );
                setTodos(updatedTodos);
                saveTodosToLocalStorage(updatedTodos);
                setEditingId(null);
            } else {
                // Crear un nuevo elemento de tarea con un ID único
                const newTodo = { id: Date.now(), ...nuevoTodo };
                setTodos((prevTodos) => [...prevTodos, newTodo]);
                saveTodosToLocalStorage([...todos, newTodo]);
            }
            // Restablecer los valores del nuevo elemento a su estado inicial
            setNuevoTodo({
                todoNombre: "",
                todoDescripcion: "",
                todoEstado: "pendiente",
            });
        }
    };

    // Manejador de eliminación de una tarea
    const handleDelete = (id) => {
        // Filtrar la lista de tareas para eliminar el elemento correspondiente
        const updatedTodos = todos.filter((todo) => todo.id !== id);
        setTodos(updatedTodos);
        saveTodosToLocalStorage(updatedTodos);
    };

    // Manejador de cambio de estado de una tarea (pendiente/completada)
    const handleToggle = (id) => {
        // Actualizar el estado de la tarea correspondiente
        const updatedTodos = todos.map((todo) =>
            todo.id === id
                ? {
                    ...todo,
                    todoEstado:
                        todo.todoEstado === "pendiente" ? "completado" : "pendiente",
                }
                : todo
        );
        setTodos(updatedTodos);
        saveTodosToLocalStorage(updatedTodos);
    };

    // Manejador de edición de una tarea
    const handleEdit = (id) => {
        // Buscar el elemento correspondiente en la lista de tareas
        const todoToEdit = todos.find((todo) => todo.id === id);
        setNuevoTodo(todoToEdit);
        setEditingId(id);
    };

    const saveTodosToLocalStorage = (todos) => {
        // Función para guardar la lista de tareas en el localStorage
        localStorage.setItem("todos", JSON.stringify(todos));
    };


    return (
        <div className="container">
            <div className="row">
                <div className="col-sm-6">
                    <h2 className="text-info">Formulario Controlado</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            className="form-control mb-2"
                            type="text"
                            placeholder="Ingrese un TODO"
                            name="todoNombre"
                            value={nuevoTodo.todoNombre}
                            onChange={handleOnChange}
                        />
                        <textarea
                            className="form-control mb-2"
                            placeholder="Ingrese una descripción"
                            name="todoDescripcion"
                            value={nuevoTodo.todoDescripcion}
                            onChange={handleOnChange}
                        />
                        <select
                            className="form-select mb-2"
                            name="todoEstado"
                            value={nuevoTodo.todoEstado}
                            onChange={handleOnChange}
                        >
                            <option value="pendiente">Pendiente</option>
                            <option value="completado">Completado</option>
                        </select>
                        <div className="d-grid gap-2">
                            <button className="btn btn-info" type="submit">
                                {editingId !== null ? "Actualizar" : "Agregar"}
                            </button>
                        </div>
                        <hr />
                    </form>
                </div>
                <div className="col-sm-6">
                    <h2 className="text-info">Tareas</h2>
                    <table className="table mt-2">
                        <thead>
                            <tr>
                                <th>Tarea</th>
                                <th>Descripción</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {todos.map((todo) => (
                                <tr
                                    key={todo.id}
                                    className={
                                        todo.todoEstado === "completado"
                                            ? "table-success"
                                            : "table-secondary"
                                    }
                                >
                                    <td className={todo.todoEstado === "completado" ? "completed-task" : ""}>{todo.todoNombre}</td>
                                    <td className={todo.todoEstado === "completado" ? "completed-task" : ""}>{todo.todoDescripcion}</td>
                                    <td className="actions-cell">
                                        <button
                                            className="btn btn-sm btn-primary"
                                            onClick={() => handleEdit(todo.id)}
                                        >
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleDelete(todo.id)}
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                        <button
                                            className={`btn btn-sm ${todo.todoEstado === "pendiente" ? "btn-success" : "btn-warning"}`}
                                            onClick={() => handleToggle(todo.id)}
                                        >
                                            {todo.todoEstado === "pendiente" ? (
                                                <i className="fas fa-check"></i>
                                            ) : (
                                                <i className="fas fa-undo"></i>
                                            )}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Controlado;
