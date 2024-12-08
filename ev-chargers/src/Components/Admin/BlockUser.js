//TO DO

function BlockUser(){
    return (
        <div>
        <h3>Block Users</h3>
        <ul>
          {users.map((user, index) => (
            <li key={index}>
              {user.name} {user.lastname} - Email: {user.email}
              <button onClick={() => onUnblockUser(driver.id)}>Unblock</button>
              <button onClick={() => onBlockUser(driver.id)}>Block</button>
            </li>
          ))}
        </ul>
        </div>
    )
}
export default BlockUser;