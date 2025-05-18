import React, { useState, useEffect } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import {
  FaChartBar,
  FaGlobe,
  FaPaintBrush,
  FaBox,
  FaShoppingCart,
  FaCalendarAlt,
  FaBook,
  FaHeart,
} from "react-icons/fa";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Avatar from "@mui/material/Avatar";
import { Link } from "react-router-dom";
import "./style.css";

const AdminSidebar = ({ onCollapseChange }) => {
  const [isCollapsed, setCollapsed] = useState(false);

  const handleCollapse = () => {
    setCollapsed(!isCollapsed);
  };

  useEffect(() => {
    onCollapseChange(isCollapsed);
  }, [isCollapsed, onCollapseChange]);

  return (
    <div style={{ display: "flex", zIndex: 1000 }}>
      {/* Collapse Button */}
      <Box
        sx={{
          "& > :not(style)": {
            position: "fixed",
            top: "40px",
            left: isCollapsed ? "55px" : "220px",
            transition: "left 0.3s ease-in-out",
            zIndex: 1001,
          },
        }}
      >
        <Fab color="primary" aria-label="collapse" onClick={handleCollapse}>
          {isCollapsed ? <ArrowForwardIosIcon /> : <ArrowBackIosIcon />}
        </Fab>
      </Box>

      {/* Sidebar */}
      <Sidebar
        collapsed={isCollapsed}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          width: isCollapsed ? "70px" : "250px",
          backgroundColor: "#fabfa7",
          border: "none",
          borderRadius: "0 20px 20px 0",
          transition: "width 0.3s ease-in-out",
          zIndex: 1000,
          overflowY: "auto",
        }}
      >
        {/* Sidebar Header */}
        <div className="sidebar-header mb-20 text-center">
          {isCollapsed ? (
            <h4
              style={{
                color: "black",
                fontWeight: "bold",
                backgroundColor: "yellow",
                borderRadius: "10px",
                padding: "5px",
                margin: "20px 10px",
                textAlign: "center",
              }}
            >
              YE
            </h4>
          ) : (
            <h4
              style={{
                color: "black",
                fontWeight: "bold",
                backgroundColor: "yellow",
                borderRadius: "10px",
                padding: "5px",
                width: "200px",
                margin: "20px auto",
                textAlign: "center",
              }}
            >
              YUM Express
            </h4>
          )}
        </div>

        {/* Menu Items */}
        <Menu
          menuItemStyles={{
            button: {
              "&:hover": {
                backgroundColor: "#4B0082",
                color: "black",
              },
            },
          }}
        >
          <SubMenu
            label={isCollapsed ? "" : "Deliver Management"}
            icon={<FaChartBar />}
          >
            <Link to="/dashboard/deliver">
              <MenuItem suffix={<span className="badge red">6</span>}>
                Vehicle List
              </MenuItem>
            </Link>
            <Link to="/dashboard/route">
              <MenuItem suffix={<span className="badge red">6</span>}>
                Route List
              </MenuItem>
            </Link>
          </SubMenu>

          <SubMenu label={isCollapsed ? "" : "Customer"} icon={<FaGlobe />}>
            <MenuItem>Google Maps</MenuItem>
            <MenuItem>OpenStreetMap</MenuItem>
          </SubMenu>

          <SubMenu
            label={isCollapsed ? "" : "Suppliers"}
            icon={<FaPaintBrush />}
          >
            <MenuItem>Dark Mode</MenuItem>
            <MenuItem>Light Mode</MenuItem>
          </SubMenu>

          <SubMenu label={isCollapsed ? "" : "Employees"} icon={<FaBox />}>
            <MenuItem>Buttons</MenuItem>
            <MenuItem>Cards</MenuItem>
          </SubMenu>

          <SubMenu
            label={isCollapsed ? "" : "Inquiry"}
            icon={<FaShoppingCart />}
          >
            <MenuItem>Products</MenuItem>
            <MenuItem>Orders</MenuItem>
          </SubMenu>

          <SubMenu label={isCollapsed ? "" : "Orders"} icon={<FaCalendarAlt />}>
            <MenuItem>View Calendar</MenuItem>
          </SubMenu>

          <MenuItem icon={<FaBook />}>
            {isCollapsed ? <FaBook /> : "Feedback"}
          </MenuItem>

          <MenuItem icon={<FaHeart />}>
            {isCollapsed ? <FaHeart /> : "Service"}
          </MenuItem>
        </Menu>

        {/* Sidebar Footer */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            backgroundColor: "#2e2e2e",
            padding: "10px",
            textAlign: isCollapsed ? "center" : "left",
          }}
        >
          {isCollapsed ? (
            <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "0 15px",
              }}
            >
              <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
              <p style={{ color: "#fff", margin: 0 }}>Admin</p>
            </div>
          )}
        </div>
      </Sidebar>
    </div>
  );
};

export default AdminSidebar;
