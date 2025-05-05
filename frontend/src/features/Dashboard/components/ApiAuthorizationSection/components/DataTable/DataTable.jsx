import React from 'react';
import styles from './DataTable.module.css';

const DataTable = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className={styles.noData}> {/* Use styles */}
        Brak danych do wyświetlenia
      </div>
    );
  }

  return (
    <div className={styles.tableContainer}> {/* Use styles */}
      <table className={styles.table}> {/* Use styles */}
        <thead className={styles.tableHead}> {/* Use styles */}
          <tr>
            <th className={styles.tableHeader}>ID</th> {/* Use styles */}
            <th className={styles.tableHeader}>Data Cell 1</th> {/* Use styles */}
            <th className={styles.tableHeader}>Data Cell 2</th> {/* Use styles */}
            <th className={styles.tableHeader}>Timestamp</th> {/* Use styles */}
          </tr>
        </thead>
        <tbody className={styles.tableBody}> {/* Use styles */}
          {data.map((item) => (
            <tr key={item.id} className={styles.tableRow}> {/* Use styles */}
              <td className={styles.tableCell}>{item.id}</td> {/* Use styles */}
              <td className={styles.tableCell}>{item.dataCell1}</td> {/* Use styles */}
              <td className={styles.tableCell}>{item.dataCell2}</td> {/* Use styles */}
              <td className={styles.tableCell}> {/* Use styles */}
                {item.timestampCell ? new Date(item.timestampCell).toLocaleString() : 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;

