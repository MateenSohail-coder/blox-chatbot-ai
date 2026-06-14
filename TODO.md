# TODO

- [ ] Inspect current chat UI + routes usage in `app/dashboard/Chats/[id]/page.js`.
- [ ] Update `app/dashboard/Chats/[id]/page.js`:
  - [ ] Remove sessionStorage “pending first message” logic.
  - [ ] For first user message: call non-stream endpoint and render assistant response as plain (not stream).
  - [ ] For subsequent messages: use streaming endpoint.
- [ ] Update `app/api/Conversation/messages/route.js` to generate non-stream assistant response (OpenAI `stream:false`) and return assistant message in JSON.
- [ ] Verify/fix `app/api/Conversation/messages/stream/route.js`:
  - [ ] Ensure OpenAI prompt history is ordered and formatted correctly.
  - [ ] Ensure SSE payloads match frontend parsing (`data: { delta }` then `data: { done: true, assistant }`).
  - [ ] Ensure assistant message saved successfully.
- [ ] Run dev server and manually test:
  - [ ] First message in fresh conversation returns plain assistant response.
  - [ ] Next messages stream correctly.
  - [ ] No sessionStorage involvement for initial message.

