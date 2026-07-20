const css = `
  .running-text-container {
    position: relative;
    width: 100%;
    overflow: hidden;
    background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
    padding: 16px 0;
  }

  .running-text-wrapper {
    display: flex;
    width: 100%;
    overflow: hidden;
  }

  .running-text-content {
    display: flex;
    animation: scroll 30s linear infinite;
    white-space: nowrap;
  }

  .running-text-item {
    display: flex;
    align-items: center;
    padding: 0 40px;
    font-family: 'Barlow', system-ui, sans-serif;
    font-size: 1.25rem;
    font-weight: 600;
    color: #ffffff;
    letter-spacing: 0.05em;
  }

  .running-text-item::after {
    content: '•';
    margin-left: 40px;
    color: #60a5fa;
    font-size: 1.5rem;
  }

  .running-text-item:last-child::after {
    content: '';
  }

  @keyframes scroll {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-50%);
    }
  }

  @media (max-width: 768px) {
    .running-text-item {
      font-size: 1rem;
      padding: 0 24px;
    }

    .running-text-item::after {
      margin-left: 24px;
      font-size: 1.25rem;
    }
  }
`;

export function RunningText() {
  const textItems = [
    'Kualitas Terjamin',
    'Distribusi Nasional',
    'Customer First',
    'Safety First',
    'Innovation',
    'Reliability',
    'Sustainability'
  ];

  return (
    <div className="running-text-container">
      <style>{css}</style>
      <div className="running-text-wrapper">
        <div className="running-text-content">
          {textItems.map((item, index) => (
            <div key={index} className="running-text-item">
              {item}
            </div>
          ))}
          {/* Duplicate for seamless loop */}
          {textItems.map((item, index) => (
            <div key={`duplicate-${index}`} className="running-text-item">
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
