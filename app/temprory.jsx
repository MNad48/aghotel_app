{tables && (
    <Picker
      selectedValue={selectedTable}
      onValueChange={(itemValue, itemIndex) =>
        setSelectedTable(itemValue)
      }
      style={styles.picker}>
      <Picker.Item label="Select a table" value={null} />
      {tables.map(table => (
        <Picker.Item
          key={table.table_id}
          label={table.table_name}
          value={table.table_id}
        />
      ))}
    </Picker>
  )}