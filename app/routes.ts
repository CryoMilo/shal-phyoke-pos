import { type RouteConfig, route, index } from "@react-router/dev/routes";

export default [
	index("routes/home.tsx"),
	route("menu", "routes/menu/menu.tsx", [
		route("create", "routes/menu/create.tsx"),
	]),
] satisfies RouteConfig;
