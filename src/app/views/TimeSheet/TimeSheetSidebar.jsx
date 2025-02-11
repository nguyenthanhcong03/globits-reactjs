import { Button, ListItem, ListItemText, makeStyles, TextField } from "@material-ui/core";
import useDebounce from "app/hooks/useDebounce";
import { useEffect } from "react";
import { FixedSizeList } from "react-window";
import { useStore } from "../../stores";

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

  const { setProjectId } = timeSheetStore;
  const { fetchProjects, projectList, selectedProject, setSelectedProject, keyword, setKeyword } = projectStore;

  const debounce = useDebounce(keyword, 3000);

  useEffect(() => {
    fetchProjects();
  }, [debounce]);

  return (
    <div className={classes.sidebar}>
      <p className={classes.title}>Danh sách dự án:</p>
      <div className={classes.contentSidebar}>
        <Button
          style={{
            backgroundColor: selectedProject === null ? "#FB9678" : "transparent",
            color: selectedProject === null ? "#fff" : "#FB9678",
            borderRadius: "5px",
            transition: "background-color 0.3s",
          }}
          fullWidth
          color="secondary"
          onClick={() => {
            setProjectId("");
            setSelectedProject(null);
          }}
        >
          Tất cả
        </Button>
        <div className={classes.searchWrapper}>
          <TextField
            variant="outlined"
            fullWidth
            size="small"
            placeholder="Tìm kiếm dự án"
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              console.log(e.target.value);
            }}
          />
        </div>
        <div>
          {projectList?.length > 0 ? (
            <FixedSizeList height={300} width="100%" itemSize={40} itemCount={projectList.length}>
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
                      setSelectedProject(project);
                      setProjectId(project?.id);
                    }}
                  >
                    <ListItemText style={{ textAlign: "center" }} primary={project.name} />
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
