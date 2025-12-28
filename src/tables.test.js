// src/tables.test.js
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import Domma from './index.js';

describe('Domma.tables - Tables Module', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    container.id = 'table-container';
    document.body.appendChild(container);
  });

  afterEach(() => {
    // Clean up the container after each test
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
    container = null;
  });

  const sampleData = [
    {id: 1, name: 'Alice', age: 30},
    {id: 2, name: 'Bob', age: 25},
    {id: 3, name: 'Charlie', age: 35},
  ];
  const sampleColumns = [
    {key: 'id', title: 'ID'},
    {key: 'name', title: 'Name'},
    {key: 'age', title: 'Age'},
  ];

  it('create() should create a basic table instance', () => {
    const table = Domma.tables.create('#table-container', {
      data: sampleData,
      columns: sampleColumns,
    });
    expect(table).not.toBeNull();
    expect(typeof table.getData).toBe('function');
    expect(container.querySelector('table')).not.toBeNull();
  });

  it('getData() should return the current page of data', () => {
    const table = Domma.tables.create('#table-container', {
      data: sampleData,
      columns: sampleColumns,
    });
    const retrieved = table.getData();
    expect(retrieved.length).toBe(3); // Default page size is 10
    expect(retrieved[0].name).toBe('Alice');
  });

  it('addRow() should add data to the table', () => {
    const table = Domma.tables.create('#table-container', {
      data: [{id: 1, name: 'Alice'}],
      columns: sampleColumns,
    });
    table.addRow({id: 2, name: 'Bob'});
    // getData() only shows the current page, so check the internal filtered data
    expect(table.getFilteredData().length).toBe(2);
    expect(table.getFilteredData()[1].name).toBe('Bob');
  });

  it('search() should filter the data in the table', () => {
    const table = Domma.tables.create('#table-container', {
      data: sampleData,
      columns: sampleColumns,
    });
    table.search('Bob');
    const filtered = table.getFilteredData(); // Use getFilteredData for the full filtered list
    expect(filtered.length).toBe(1);
    expect(filtered[0].name).toBe('Bob');
  });

  it('setData([]) should clear all data from the table', () => {
    const table = Domma.tables.create('#table-container', {
      data: sampleData,
      columns: sampleColumns,
    });
    table.setData([]); // Use setData to clear
    expect(table.getData().length).toBe(0);
  });

  it('toJSON() should export table data as a JSON string', () => {
    const table = Domma.tables.create('#table-container', {
      data: [{id: 1, name: 'Alice'}],
      columns: [{key: 'id', title: 'ID'}, {key: 'name', title: 'Name'}],
    });
    const json = table.toJSON();
    expect(typeof json).toBe('string');
    const parsed = JSON.parse(json);
    expect(parsed.length).toBe(1);
    expect(parsed[0].name).toBe('Alice');
  });

  it('toCSV() should export table data as a CSV string', () => {
    const table = Domma.tables.create('#table-container', {
      data: [{id: 1, name: 'Alice'}],
      columns: [{key: 'id', title: 'ID'}, {key: 'name', title: 'Name'}],
    });
    const csv = table.toCSV();
    expect(typeof csv).toBe('string');
    expect(csv).toContain('"ID","Name"'); // Quoted headers
    expect(csv).toContain('"1","Alice"'); // Quoted values
  });

  it('pageInfo() should return correct pagination info', () => {
    const tableData = Array.from({length: 6}, (_, i) => ({id: i + 1}));
    const table = Domma.tables.create('#table-container', {
      data: tableData,
      columns: [{field: 'id', title: 'ID'}],
      pageSize: 2,
      pagination: true,
    });
    const info = table.pageInfo();
    expect(info.page).toBe(1);
    expect(info.pageSize).toBe(2);
    expect(info.totalPages).toBe(3);
  });
});