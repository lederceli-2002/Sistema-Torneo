import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";

//fija el menu lateral
function Layout() {
    return (
        <div className="pagina">
            <SideBar />
            <main className="contenido">
                {/* aqui se dibuja la psgina segun la ruta */}
                <Outlet />
            </main>
        </div>
    );
}

export default Layout;