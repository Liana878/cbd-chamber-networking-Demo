import { RouterProvider } from "react-router";
import { router } from "./routes";
import { AuthProvider } from "./contexts/AuthContext";
import { AppStateProvider } from "./contexts/AppStateContext";

export default function App() {
  return (
    <AuthProvider>
      <AppStateProvider>
        <RouterProvider router={router} />
      </AppStateProvider>
    </AuthProvider>
  );
}
