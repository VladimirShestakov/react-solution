export default {
  title: 'Modal windows',
  ok: 'Ok',
  cancel: 'Cancel',
  cascade: {
    title: 'Windows cascade',
    message: 'Open another window without closing the current one',
    messageCount: {
      one: '{{plural}} window open.',
      other: '{{plural}} windows open.',
    },
    openMore: 'Open more',
  },
  content: {
    first: `Modal windows are displayed on top of the current page, making the page elements
      inaccessible until the window is closed. Modal window management is handled by the modals service.
      To open a window, the open method is called with the token and window properties as arguments.
      The window token is essentially an identifier by which the React component is registered in the DI container.
      The window properties are the props that are passed to the React component.`,
    second: `Any React component can become a window — it just needs to be registered in the DI container.
      Through the DI container, the component becomes available via a token, and it can be used not only to open as a modal window.
      The window's layout, including the overlay, must be implemented within the component itself.
      The close callback function is automatically passed to the window component to close the window and pass the result.`,
    example: `Example of displaying a page as a modal window.
      The page will be displayed below since it is positioned according to the normal document flow.
      In contrast, the markup for modal windows uses absolute or fixed positioning.`,
    openPage: `Open the current page using the modal service.`,
  },
};
