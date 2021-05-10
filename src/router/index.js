import React, { lazy } from "react";
import { Route, Redirect, Switch, withRouter } from "react-router-dom";
import routerConfig from "./routerConfig";

const renderRoute = () => {
	return (
		<Switch>
			<Route
				path={"/"}
				exact
				render={(props) => <Redirect to={{ pathname: routerConfig[0].path }} />}
			/>
			{routerConfig.map((route) => {
				return (
					<Route
						key={route.path}
						path={route.path}
						exact
						component={() => {
							const Comp = lazy(() => import(`../pages${route.componentPath}`));
							const Result = withRouter(Comp);
							return <Result />;
						}}
					/>
				);
			})}
		</Switch>
	);
};

export default renderRoute;
