import React, { useEffect, useRef, useState } from "react";
import classnames from "classnames";
import { Dropdown, Menu } from "antd";
import history from "@/history";
import "./index.less";
import pageConfig from "@/pageConfig";
import routerConfig from "@/router/routerConfig";

export const MenuTypeEnum = {
	name: "name",
	groupName: "group-name",
	groupTypeName: "group-type-name",
};

//处理菜单
let route = [];
let firstMenuItem = null;
const addRoute = (menu, parentMenu) => {
	let type = "";
	if (menu.name) {
		if (!parentMenu) {
			type = MenuTypeEnum.groupName;
		} else if (Array.isArray(menu.children) && menu.children.length > 0) {
			type = MenuTypeEnum.groupTypeName;
		} else {
			type = MenuTypeEnum.name;
		}
		const menuItemData = {
			type,
			name: menu.name,
			path: menu.path,
			component: menu.component,
		};
		if (
			type === MenuTypeEnum.name &&
			!firstMenuItem &&
			menu.component &&
			menu.path
		) {
			firstMenuItem = menuItemData;
		}
		route.push(menuItemData);
	}
	if (Array.isArray(menu.children) && menu.children.length > 0) {
		menu.children.forEach((item) => {
			addRoute(item, menu);
		});
	}
};
Array.isArray(pageConfig) &&
	pageConfig.forEach((menu) => {
		addRoute(menu, null);
	});

console.log(route);

function MenuList(props) {
	const [currentMenuPath, setCurrentMenuPath] = useState(() => {
		const pathName = window.location.pathname;
		let result = "";
		if (Array.isArray(routerConfig)) {
			for (let i = 0, len = routerConfig.length; i < len; i++) {
				const item = routerConfig[i];
				if (item.path === pathName) {
					result = item.path;
					break;
				}
			}
		}
		return result;
	}); // 当前菜单Path
	// 具体菜单的样式
	const menuItemClassName = (item) => {
		const { type, path } = item;
		return classnames("menu-item", {
			[`menu-item-${type}`]: type,
			[`menu-item-click`]: path,
			[`menu-item-current`]: path === currentMenuPath,
		});
	};

	const selectMenu = (e, menu) => {
		const { type, path } = menu;
		if (path && path !== currentMenuPath) {
			// 如果不是组件子类，则直接跳转到其他页面
			if (type === MenuTypeEnum.name) {
				history.push(path);
				setCurrentMenuPath(path);
			}
		}
	};

	return (
		<div className="menu-list-box">
			<div className="left-menu">
				<section className="container">
					<ul className="menu-inline">
						{Array.isArray(route) &&
							route.map((item, index) => {
								if (item.type !== MenuTypeEnum.name) {
									return (
										<div
											key={`${item.name}${index}`}
											className={menuItemClassName(item)}
											onClick={(e) => {
												selectMenu(e, item);
											}}
										>
											<span className="text">{item.name}</span>
										</div>
									);
								}
								return (
									<li
										className={menuItemClassName(item)}
										key={`${item.name}${index}`}
										onClick={(e) => {
											selectMenu(e, item);
										}}
									>
										<span className="text">{item.name}</span>
									</li>
								);
							})}
					</ul>
				</section>
			</div>
		</div>
	);
}

export default MenuList;
