# use-cancelable

React Hook for creating a cancelable promise to avoid state mutations after a component has unmounted.

# Installation

Install by using
`npm i -S use-cancelable` or `yarn add use-cancelable`

# Usage

Import the hook
`import useCancelable from 'use-cancelable';`

Then in your Functional React Component invoke the hook to acquire a wrapper function you can use on your promises

```
export default function Foo() {
  // hook
  const cancelable = useCancelable();


  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    cancelable(makeAsyncRequest()).then(() => {
      // request has completed
      setLoading(false);
    })
  }, [])
  // ...
}

```

**Note** The cancelable method accepts an optional second parameter to make the promise reject when it resolves after cancelation. The rejection is passed a single object parameter:

```
{isCanceled: true}
```