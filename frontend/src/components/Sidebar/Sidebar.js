import React, { useState, useEffect } from "react";
import { Drawer, IconButton, List } from "@material-ui/core";
import {
  Home as HomeIcon,
  NotificationsNone as NotificationsIcon,
  FormatSize as TypographyIcon,
  FilterNone as UIElementsIcon,
  BorderAll as TableIcon,
  ArrowBack as ArrowBackIcon,
} from "@material-ui/icons";
import { useTheme } from "@material-ui/styles";
import { withRouter } from "react-router-dom";
import classNames from "classnames";
import {useUserState} from "../../context/UserContext";
// styles
import useStyles from "./styles";

// components
import SidebarLink from "./components/SidebarLink/SidebarLink";

// context
import {
  useLayoutState,
  useLayoutDispatch,
  toggleSidebar,
} from "../../context/LayoutContext";

const structure = [
  { id: 0, 
    label: "Quản lý tài khoản", 
    link: "/app/accounts", 
    icon: <HomeIcon /> 
  },
  {
    id: 1,
    label: "Quản lý đơn hàng",
    link: "/app/orders",
    icon: <TypographyIcon />,
  },
  { id: 2, label: "Quản lý đơn hàng", link: "/app/quotations", icon: <TableIcon /> },
  {
    id: 3,
    label: "Quản lý vật tư",
    link: "/app/supplies",
    icon: <UIElementsIcon />,
  },
  {
    id: 4,
    label: "Quản lý thông báo",
    link: "/app/notifications",
    icon: < NotificationsIcon/>,
  }
];

function Sidebar({ location }) {
  var classes = useStyles();
  var theme = useTheme();
  let {isAdmin, isEngineering, isManager} = useUserState();
  // global
  var { isSidebarOpened } = useLayoutState();
  var layoutDispatch = useLayoutDispatch();

  // local
  var [isPermanent, setPermanent] = useState(true);

  useEffect(function() {
    window.addEventListener("resize", handleWindowWidthChange);
    handleWindowWidthChange();
    return function cleanup() {
      window.removeEventListener("resize", handleWindowWidthChange);
    };
  });

  return (
    <Drawer
      variant={isPermanent ? "permanent" : "temporary"}
      className={classNames(classes.drawer, {
        [classes.drawerOpen]: isSidebarOpened,
        [classes.drawerClose]: !isSidebarOpened,
      })}
      classes={{
        paper: classNames({
          [classes.drawerOpen]: isSidebarOpened,
          [classes.drawerClose]: !isSidebarOpened,
        }),
      }}
      open={isSidebarOpened}
    >
      <div className={classes.toolbar} />
      <div className={classes.mobileBackButton}>
        <IconButton onClick={() => toggleSidebar(layoutDispatch)}>
          <ArrowBackIcon
            classes={{
              root: classNames(classes.headerIcon, classes.headerIconCollapse),
            }}
          />
        </IconButton>
      </div>
      <List className={classes.sidebarList}>
        {/* 0: account, 1: orders, 2: quotation, 3: supplies, 4:notifications */}
          { (isAdmin) &&
            <SidebarLink
              key={structure[0].id}
              location={location}
              isSidebarOpened={isSidebarOpened}
              {...structure[0]}
            />
          }
          {(isEngineering) && 
            <SidebarLink
              key={structure[1].id}
              location={location}
              isSidebarOpened={isSidebarOpened}
              {...structure[1]}
            />
          }
          {(isAdmin || isManager) && 
            <SidebarLink
              key={structure[2].id}
              location={location}
              isSidebarOpened={isSidebarOpened}
              {...structure[2]}
            />
          }
          {(isAdmin || isManager) && 
            <SidebarLink
              key={structure[3].id}
              location={location}
              isSidebarOpened={isSidebarOpened}
              {...structure[3]}
            />
          }
          {(isAdmin || isEngineering || isManager) && 
            <SidebarLink
              key={structure[4].id}
              location={location}
              isSidebarOpened={isSidebarOpened}
              {...structure[4]}
            />
          }
      </List>
    </Drawer>
  );

  // ##################################################################
  function handleWindowWidthChange() {
    var windowWidth = window.innerWidth;
    var breakpointWidth = theme.breakpoints.values.md;
    var isSmallScreen = windowWidth < breakpointWidth;

    if (isSmallScreen && isPermanent) {
      setPermanent(false);
    } else if (!isSmallScreen && !isPermanent) {
      setPermanent(true);
    }
  }
}

export default withRouter(Sidebar);
