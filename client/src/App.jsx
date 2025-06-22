import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

// Lazy load all pages
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Home = lazy(() => import("./pages/Home"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const CreateListing = lazy(() => import("./pages/CreateListing"));
const EditListing = lazy(() => import("./pages/EditListing"));
const Profile = lazy(() => import("./pages/Profile"));
const ListingDetails = lazy(() => import("./pages/ListingDetails"));
const MyBookings = lazy(() => import("./pages/MyBookings"));

function App() {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Suspense
            fallback={
              <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            }
          >
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected routes with Layout */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Home />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="create-listing" element={<CreateListing />} />
                <Route path="edit-listing/:id" element={<EditListing />} />
                <Route path="profile" element={<Profile />} />
                <Route path="my-bookings" element={<MyBookings />} />
                <Route path="listing/:id" element={<ListingDetails />} />

                {/* Catch all route - 404 */}
                <Route
                  path="*"
                  element={
                    <div className="flex items-center justify-center py-16">
                      <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-900">
                          404
                        </h1>
                        <p className="text-gray-600">Page not found</p>
                      </div>
                    </div>
                  }
                />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}

export default App;
