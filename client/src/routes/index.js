import { useRoutes } from "react-router";
import shop from "./shop";
import home from "./home";

export default () => useRoutes([...home, ...shop])