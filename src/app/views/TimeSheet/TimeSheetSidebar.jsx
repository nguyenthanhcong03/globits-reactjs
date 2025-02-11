import { Button, ListItem, ListItemText, makeStyles, TextField } from "@material-ui/core";
import { useStore } from "../../stores";
import React, { useEffect, useState } from "react";
import { FixedSizeList } from "react-window";
import useDebounce from "app/hooks/useDebounce";

const useStyles = makeStyles((theme) => ({
  sidebar: {
    display: "flex",
    flexDirection: "column",
    width: "20%",
    height: "100%",
  },
  title: {
    fontWeight: "bold",
    width: "100%",
    padding: "10px",
    textAlign: "center",
    color: "#fff",
    fontSize: "20px",
    backgroundColor: "#01C0C8",
  },
  contentSidebar: {
    padding: "20px",
  },
  searchWrapper: {
    margin: "10px 0",
    borderRadius: theme.shape.borderRadius,
    width: "100%",
    alignItems: "center",
  },
}));

function TimeSheetSidebar() {
  const classes = useStyles();
  const { projectStore, timeSheetStore } = useStore();

  const { setProjectId, search } = timeSheetStore;
  const { fetchProjects, projectList } = projectStore;

  const [selectedProject, setSelectProject] = useState(null);
  const debounceProject = useDebounce(projectStore.keyword, 300);

  useEffect(() => {
    fetchProjects();
  }, [debounceProject]);

  return (
    <div className={classes.sidebar}>
      <p className={classes.title}>Danh sách dự án:</p>
      <div className={classes.contentSidebar}>
        <Button
          fullWidth
          color="secondary"
          onClick={() => {
            setProjectId("");
          }}
        >
          Tất cả
        </Button>
        <div className={classes.searchWrapper}>
          <TextField
            variant="outlined"
            fullWidth
            size="small"
            placeholder="Tìm kiếm"
            classes={{
              root: classes.inputRoot,
              input: classes.searchInput,
            }}
            onChange={(e) => projectStore.setKeyword(e.target.value)}
            value={projectStore.keyword}
            inputProps={{ "aria-label": "search" }}
          />
        </div>
        <div className="">
          {projectStore.projectList?.length > 0 ? (
            <FixedSizeList height={300} width="100%" itemSize={40} itemCount={projectStore.projectList.length}>
              {({ index, style }) => {
                const project = projectList[index];

                return (
                  <ListItem
                    button
                    key={project.id}
                    style={{
                      ...style,
                      backgroundColor: selectedProject?.id === project.id ? "#FB9678" : "transparent",
                      color: selectedProject?.id === project.id ? "#fff" : "#FB9678",
                      borderRadius: "5px",
                      transition: "background-color 0.3s",
                    }}
                    onClick={() => {
                      setSelectProject(project);
                      setProjectId(project?.id);
                      projectStore.setSelectedProject(project);
                    }}
                  >
                    <ListItemText primary={project.name} />
                  </ListItem>
                );
              }}
            </FixedSizeList>
          ) : (
            "Không có dự án nào"
          )}
        </div>
      </div>
    </div>
  );
}

export default TimeSheetSidebar;
