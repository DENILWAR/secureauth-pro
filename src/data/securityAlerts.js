// Security alerts and threat detection data
export const securityAlerts = [
    {
      id: 'alert_001',
      type: 'suspicious_login',
      severity: 'high',
      status: 'active',
      title: 'Suspicious Login Attempt',
      description: 'Multiple failed login attempts from unusual location',
      timestamp: '2025-06-16T10:30:00Z',
      location: 'Beijing, China',
      ipAddress: '203.0.113.1',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      details: {
        attemptCount: 5,
        timeWindow: '15 minutes',
        blockedAt: '2025-06-16T10:32:00Z',
        riskScore: 8.5
      },
      actions: [
        { type: 'block_ip', status: 'completed', timestamp: '2025-06-16T10:32:00Z' },
        { type: 'notify_user', status: 'completed', timestamp: '2025-06-16T10:32:30Z' }
      ],
      resolved: false
    },
    {
      id: 'alert_002',
      type: 'unusual_location',
      severity: 'medium',
      status: 'investigating',
      title: 'Login from New Location',
      description: 'User logged in from a location not seen in the past 90 days',
      timestamp: '2025-06-16T09:15:00Z',
      location: 'São Paulo, Brazil',
      ipAddress: '198.51.100.42',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
      details: {
        previousLocations: ['Madrid, Spain', 'Barcelona, Spain'],
        distanceFromUsual: '8,500 km',
        riskScore: 6.2,
        deviceType: 'mobile'
      },
      actions: [
        { type: 'request_verification', status: 'pending', timestamp: '2025-06-16T09:15:30Z' }
      ],
      resolved: false
    },
    {
      id: 'alert_003',
      type: 'multiple_sessions',
      severity: 'medium',
      status: 'monitoring',
      title: 'Multiple Active Sessions',
      description: 'User has 4 simultaneous active sessions across different devices',
      timestamp: '2025-06-16T08:45:00Z',
      location: 'Multiple',
      ipAddress: 'Multiple',
      details: {
        sessionCount: 4,
        devices: ['Desktop - Chrome', 'Mobile - Safari', 'Tablet - Edge', 'Desktop - Firefox'],
        locations: ['Madrid, Spain', 'Barcelona, Spain', 'Valencia, Spain', 'Seville, Spain'],
        riskScore: 5.8
      },
      actions: [
        { type: 'monitor_sessions', status: 'active', timestamp: '2025-06-16T08:45:00Z' }
      ],
      resolved: false
    },
    {
      id: 'alert_004',
      type: 'password_breach',
      severity: 'critical',
      status: 'resolved',
      title: 'Password Found in Data Breach',
      description: 'User password was found in a recent data breach database',
      timestamp: '2025-06-15T14:20:00Z',
      location: 'N/A',
      ipAddress: 'N/A',
      details: {
        breachSource: 'External Database',
        breachDate: '2025-06-10',
        riskScore: 9.8,
        affectedAccounts: 1
      },
      actions: [
        { type: 'force_password_reset', status: 'completed', timestamp: '2025-06-15T14:25:00Z' },
        { type: 'notify_user', status: 'completed', timestamp: '2025-06-15T14:25:30Z' },
        { type: 'enable_2fa_requirement', status: 'completed', timestamp: '2025-06-15T14:30:00Z' }
      ],
      resolved: true,
      resolvedAt: '2025-06-15T16:45:00Z'
    },
    {
      id: 'alert_005',
      type: 'device_fingerprint_mismatch',
      severity: 'medium',
      status: 'active',
      title: 'Unrecognized Device Characteristics',
      description: 'Login attempt from device with modified characteristics',
      timestamp: '2025-06-16T07:30:00Z',
      location: 'Madrid, Spain',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      details: {
        fingerprintChanges: ['Screen resolution', 'Browser plugins', 'System fonts'],
        suspicionLevel: 'medium',
        riskScore: 6.5,
        possibleCauses: ['Browser update', 'New monitor', 'Privacy tools']
      },
      actions: [
        { type: 'require_additional_verification', status: 'pending', timestamp: '2025-06-16T07:31:00Z' }
      ],
      resolved: false
    },
    {
      id: 'alert_006',
      type: 'api_abuse',
      severity: 'high',
      status: 'mitigated',
      title: 'Unusual API Activity',
      description: 'Abnormally high number of API requests detected',
      timestamp: '2025-06-16T06:00:00Z',
      location: 'N/A',
      ipAddress: '203.0.113.200',
      details: {
        requestCount: 1500,
        timeWindow: '5 minutes',
        normalRate: '50 requests/5min',
        endpoints: ['/api/auth/verify', '/api/user/profile', '/api/security/alerts'],
        riskScore: 8.2
      },
      actions: [
        { type: 'rate_limit_ip', status: 'completed', timestamp: '2025-06-16T06:02:00Z' },
        { type: 'block_api_access', status: 'completed', timestamp: '2025-06-16T06:03:00Z' }
      ],
      resolved: true,
      resolvedAt: '2025-06-16T06:15:00Z'
    }
  ];
  
  export const alertTypes = {
    suspicious_login: {
      icon: '🚨',
      color: 'red',
      priority: 'high',
      description: 'Multiple failed login attempts or suspicious patterns'
    },
    unusual_location: {
      icon: '🌍',
      color: 'yellow',
      priority: 'medium',
      description: 'Login from an unusual geographic location'
    },
    multiple_sessions: {
      icon: '📱',
      color: 'blue',
      priority: 'medium',
      description: 'Multiple simultaneous sessions detected'
    },
    password_breach: {
      icon: '💀',
      color: 'red',
      priority: 'critical',
      description: 'Password found in known data breach'
    },
    device_fingerprint_mismatch: {
      icon: '🔍',
      color: 'orange',
      priority: 'medium',
      description: 'Device characteristics do not match known patterns'
    },
    api_abuse: {
      icon: '⚡',
      color: 'red',
      priority: 'high',
      description: 'Unusual API usage patterns detected'
    },
    account_takeover: {
      icon: '🏴‍☠️',
      color: 'red',
      priority: 'critical',
      description: 'Potential account takeover attempt'
    },
    credential_stuffing: {
      icon: '🔑',
      color: 'red',
      priority: 'high',
      description: 'Automated credential testing detected'
    },
    session_hijacking: {
      icon: '🎭',
      color: 'red',
      priority: 'critical',
      description: 'Potential session hijacking attempt'
    }
  };
  
  export const severityLevels = {
    low: {
      color: 'green',
      bgColor: 'bg-green-50',
      textColor: 'text-green-800',
      borderColor: 'border-green-200',
      icon: '✅',
      threshold: 0
    },
    medium: {
      color: 'yellow',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-800',
      borderColor: 'border-yellow-200',
      icon: '⚠️',
      threshold: 4
    },
    high: {
      color: 'orange',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-800',
      borderColor: 'border-orange-200',
      icon: '🔥',
      threshold: 7
    },
    critical: {
      color: 'red',
      bgColor: 'bg-red-50',
      textColor: 'text-red-800',
      borderColor: 'border-red-200',
      icon: '💀',
      threshold: 9
    }
  };
  
  export const alertStatuses = {
    active: {
      label: 'Active',
      color: 'red',
      description: 'Alert is currently active and requires attention'
    },
    investigating: {
      label: 'Investigating',
      color: 'yellow',
      description: 'Alert is being investigated by security team'
    },
    monitoring: {
      label: 'Monitoring',
      color: 'blue',
      description: 'Situation is being monitored for changes'
    },
    mitigated: {
      label: 'Mitigated',
      color: 'green',
      description: 'Threat has been mitigated but alert remains open'
    },
    resolved: {
      label: 'Resolved',
      color: 'gray',
      description: 'Alert has been fully resolved'
    },
    false_positive: {
      label: 'False Positive',
      color: 'gray',
      description: 'Alert was determined to be a false positive'
    }
  };
  
  export const recommendedActions = {
    block_ip: {
      title: 'Block IP Address',
      description: 'Temporarily block the suspicious IP address',
      urgency: 'immediate',
      automated: true
    },
    notify_user: {
      title: 'Notify User',
      description: 'Send security notification to the user',
      urgency: 'immediate',
      automated: true
    },
    require_2fa: {
      title: 'Require 2FA',
      description: 'Force two-factor authentication for next login',
      urgency: 'high',
      automated: true
    },
    force_password_reset: {
      title: 'Force Password Reset',
      description: 'Require user to reset their password',
      urgency: 'critical',
      automated: false
    },
    suspend_account: {
      title: 'Suspend Account',
      description: 'Temporarily suspend user account',
      urgency: 'critical',
      automated: false
    },
    manual_review: {
      title: 'Manual Review',
      description: 'Flag for manual security team review',
      urgency: 'medium',
      automated: false
    }
  };
  
  export const getActiveAlerts = () => {
    return securityAlerts.filter(alert => !alert.resolved);
  };
  
  export const getAlertsByStatus = (status) => {
    return securityAlerts.filter(alert => alert.status === status);
  };
  
  export const getAlertsBySeverity = (severity) => {
    return securityAlerts.filter(alert => alert.severity === severity);
  };
  
  export const getCriticalAlerts = () => {
    return securityAlerts.filter(alert => 
      alert.severity === 'critical' && !alert.resolved
    );
  };
  
  export const getAlertsInTimeRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return securityAlerts.filter(alert => {
      const alertDate = new Date(alert.timestamp);
      return alertDate >= start && alertDate <= end;
    });
  };
  
  export const getAlertStats = () => {
    const total = securityAlerts.length;
    const active = securityAlerts.filter(alert => !alert.resolved).length;
    const resolved = securityAlerts.filter(alert => alert.resolved).length;
    const critical = securityAlerts.filter(alert => 
      alert.severity === 'critical' && !alert.resolved
    ).length;
  
    return {
      total,
      active,
      resolved,
      critical,
      resolutionRate: total > 0 ? Math.round((resolved / total) * 100) : 0
    };
  };
  
  export const getAlertTrends = (days = 30) => {
    const trends = {};
    const now = new Date();
    
    for (let i = 0; i < days; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      
      trends[dateKey] = securityAlerts.filter(alert => {
        const alertDate = new Date(alert.timestamp).toISOString().split('T')[0];
        return alertDate === dateKey;
      }).length;
    }
    
    return trends;
  };
  
  export const getRiskScore = (alert) => {
    return alert.details?.riskScore || 0;
  };
  
  export const formatAlertForDisplay = (alert) => {
    const typeInfo = alertTypes[alert.type] || {};
    const severityInfo = severityLevels[alert.severity] || {};
    const statusInfo = alertStatuses[alert.status] || {};
    
    return {
      ...alert,
      typeInfo,
      severityInfo,
      statusInfo,
      formattedTimestamp: new Date(alert.timestamp).toLocaleString(),
      timeAgo: getTimeAgo(alert.timestamp)
    };
  };
  
  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const alertTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - alertTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };
  
  export const generateMockAlert = (type, severity = 'medium') => {
    const alertId = `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const typeInfo = alertTypes[type] || alertTypes.suspicious_login;
    
    return {
      id: alertId,
      type,
      severity,
      status: 'active',
      title: typeInfo.description,
      description: `Generated mock alert for ${type}`,
      timestamp: new Date().toISOString(),
      location: 'Mock Location',
      ipAddress: '192.168.1.100',
      userAgent: navigator.userAgent,
      details: {
        riskScore: Math.random() * 10,
        mockAlert: true
      },
      actions: [],
      resolved: false
    };
  };