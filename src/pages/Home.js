import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { useGetGradesQuery, useGetStudentsQuery } from "../store/rtk";

export default function Home() {
  const { data: students = [] } = useGetStudentsQuery();
  const { data: grades = [] } = useGetGradesQuery();
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>ID</TableCell>
          <TableCell>Student</TableCell>
          <TableCell sx={{ flex: 1 }}>Grades</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {students.map((entry) => {
          const studentGrades = grades.filter(
            ({ studentId }) => studentId === entry.id
          );
          return [
            <TableRow key={`primary-${entry.id}`}>
              <TableCell>{entry.id}</TableCell>
            </TableRow>,
            <TableRow key={`secondary-${entry.id}`}>
              <TableCell colSpan={3}>
                <Accordion>
                  <AccordionSummary>-</AccordionSummary>
                  <AccordionDetails>
                    <Grid container>
                      {studentGrades.map((item) => (
                        <Grid item key={item.id}>
                          {item.title}: {item.grade}
                        </Grid>
                      ))}
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </TableCell>
            </TableRow>,
          ];
        })}
      </TableBody>
    </Table>
  );
}
