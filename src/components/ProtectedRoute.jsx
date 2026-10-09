import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const hasValidToken = (token) => {
	try {
		const payload = token.split(".")[1];
		if (!payload) return false;

		const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
		const claims = JSON.parse(window.atob(base64));
		return Number.isFinite(claims.exp) && claims.exp * 1000 > Date.now();
	} catch {
		return false;
	}
};

export default function ProtectedRoute({ children, adminOnly = false }) {
	const { user, token, logout } = useAuth();
	const location = useLocation();
	const validToken = Boolean(token && hasValidToken(token));

	useEffect(() => {
		if (!validToken && (token || user)) logout();
	}, [validToken, token, user, logout]);

	if (!validToken || !user) {
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	if (adminOnly && String(user.role || "").toLowerCase() !== "admin") {
		return <Navigate to="/profile" replace />;
	}

	return children;
}