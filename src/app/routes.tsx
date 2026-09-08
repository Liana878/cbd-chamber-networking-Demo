import { createBrowserRouter, Navigate } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./components/Home";
import { VenueDirectory } from "./components/VenueDirectory";
import { VenueDetail } from "./components/VenueDetail";
import { MapView } from "./components/MapView";
import { QRCheckIn } from "./components/QRCheckIn";
import { Rewards } from "./components/Rewards";
import { Members } from "./components/Members";
import { MemberProfile } from "./components/MemberProfile";
import { NetworkingList } from "./components/NetworkingList";
import { CreateInvitation } from "./components/CreateInvitation";
import { InvitationDetail } from "./components/InvitationDetail";
import { MeetingCheckIn } from "./components/MeetingCheckIn";
import { AdminDashboard } from "./components/AdminDashboard";
import { Login } from "./components/Login";
import { ProtectedRoute } from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/login/credentials",
    element: <Login />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: "venues", element: <VenueDirectory /> },
      { path: "venues/:id", element: <VenueDetail /> },
      { path: "map", element: <MapView /> },
      { path: "checkin", element: <QRCheckIn /> },
      { path: "rewards", element: <Rewards /> },
      { path: "members", element: <Members /> },
      { path: "members/:id", element: <MemberProfile /> },
      { path: "invitations", element: <NetworkingList /> },
      { path: "invitations/create/:memberId", element: <CreateInvitation /> },
      { path: "invitations/:id", element: <InvitationDetail /> },
      { path: "invitations/:id/checkin", element: <MeetingCheckIn /> },
      {
        path: "admin",
        element: (
          <ProtectedRoute requireStaff>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);
