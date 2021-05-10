import React, { useEffect, useRef, useState } from "react";
import "./index.less";
import classnames from "classnames";

function Header(props) {
	const { list = [], className, style, onChange, value } = props;
	const [currentPage, setCurrentPage] = useState(null);
	const bodyClassName = classnames({
		["header-box"]: true,
		[className]: className,
	});

	const tabItemClassName = (key) => {
		return classnames({
			"tab-item": true,
			"tab-item-active": currentPage === key,
		});
	};
	/**
	 * 卡片点击
	 */
	const tabClick = (item, e) => {
		setCurrentPage(item.key);
		onChange && onChange(item.key);
	};

	useEffect(() => {
		if (Array.isArray(list) && list.length > 0) {
			setCurrentPage(value || list[0].key);
		}
	}, [value]);
	return (
		<div className={bodyClassName} style={style}>
			<div className="header-body">
				<div className="logo">
					<div className="logo-body">
						<span>WebGl学习平台</span>
					</div>
				</div>
				<div className="tabs">
					{Array.isArray(list) &&
						list.map((item) => {
							return (
								<div
									className={tabItemClassName(item.key)}
									key={item.key}
									onClick={(e) => {
										tabClick(item, e);
									}}
								>
									{item.name}
								</div>
							);
						})}
				</div>
			</div>
		</div>
	);
}

export default Header;
