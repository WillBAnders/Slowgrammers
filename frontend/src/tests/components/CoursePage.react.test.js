/**
 * @jest-environment jsdom
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { render, fireEvent, screen, queryByAttribute, waitFor } from '@testing-library/react';
import { TextField } from "@mui/material/TextField";
import { TestWatcher } from 'jest';
import 'regenerator-runtime/runtime';
import { unmountComponentAtNode } from 'react-dom';
import '@testing-library/jest-dom';
import CoursePage from '../../components/CoursePage.js';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from "react-router-dom";

let courses=[
  {code: "cop-3502", name: "Programming Fundamentals 1"}, 
  {code: "cop-3503", name: "Programming Fundamentals 2"}, 
  {code: "cot-3100", name: "Applications of Discrete Structures"},
  {code: "cop-3530", name: "Data Structures and Algorithms"},
  {code: "cen-3031", name: "Introduction to Computer Organization"},
  {code: "cda-3101", name: "Introduction to Software Engineering"},
  {code: "cis-4301", name: "Information and Database Systems"},
  {code: "cop-4020", name: "Programming Language Concepts"},
  {code: "cop-4600", name: "Operating Systems"},
  {code: "cnt-4007", name: "Computer Network Fundamentals"}
];

beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(
          {courses})
    })
  });
  
  afterEach(() => {
    jest.restoreAllMocks();
  });
  /*
 global.fetch = jest.fn(() => Promise.resolve ({
   json: () => Promise.resolve({
     courses
   })
 }))
*/
test('fetch mock', async () => {
  const result = await fetch("").then(r => r.json());
  expect(result.courses).toBe(courses);
})

test('COP returns 5', async () => {
    const div = document.createElement('div');
    var cards;
    var sourceInput;
    await waitFor(() => {
      render(<CoursePage />, {
        wrapper: MemoryRouter
    });
      sourceInput = screen.queryByTestId(/SearchBarin/i);
      cards = screen.queryByTestId(/buttonStack/i);
      fireEvent.change(sourceInput, { target: { value: 'COP' } });
    });
    expect(cards.children.length).toBe(5);
});

test('Pro returns 3', async () => {
  const div = document.createElement('div');
  var cards;
  var sourceInput;
  await waitFor(() => {
    render(<CoursePage />, {
      wrapper: MemoryRouter
  });
    sourceInput = screen.queryByTestId(/SearchBarin/i);
    cards = screen.queryByTestId(/buttonStack/i);
    fireEvent.change(sourceInput, { target: { value: 'Pro' } });
  });
  expect(cards.children.length).toBe(3);
});

test('Hebrew returns 0', async () => {
  const div = document.createElement('div');
  var cards;
  var sourceInput;
  await waitFor(() => {
    render(<CoursePage />, {
      wrapper: MemoryRouter
  });
    sourceInput = screen.queryByTestId(/SearchBarin/i);
    cards = screen.queryByTestId(/buttonStack/i);
    fireEvent.change(sourceInput, { target: { value: 'ספאם' } });
  });
  expect(cards.children.length).toBe(0);
});



test('always true', () => {
    expect(true).toBeTruthy();
});