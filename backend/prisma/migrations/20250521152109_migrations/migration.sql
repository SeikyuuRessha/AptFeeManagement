BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Apartment] (
    [id] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Apartment_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [roomNumber] INT NOT NULL,
    [area] FLOAT(53) NOT NULL,
    [buildingId] NVARCHAR(1000) NOT NULL,
    [residentId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Apartment_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Building] (
    [id] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Building_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [address] NVARCHAR(1000) NOT NULL,
    [apartmentCount] INT NOT NULL,
    CONSTRAINT [Building_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Contract] (
    [id] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Contract_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [status] NVARCHAR(1000) NOT NULL,
    [documentPath] NVARCHAR(1000) NOT NULL,
    [residentId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Contract_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Contract_residentId_key] UNIQUE NONCLUSTERED ([residentId])
);

-- CreateTable
CREATE TABLE [dbo].[InvoiceDetail] (
    [id] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [InvoiceDetail_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [quantity] INT NOT NULL,
    [total] BIGINT NOT NULL,
    [serviceId] NVARCHAR(1000) NOT NULL,
    [invoiceId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [InvoiceDetail_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Invoice] (
    [id] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Invoice_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [totalAmount] BIGINT NOT NULL,
    [dueDate] DATETIME2 NOT NULL,
    [status] NVARCHAR(1000) NOT NULL,
    [apartmentId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Invoice_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Notification] (
    [id] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Notification_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [message] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Notification_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Payment] (
    [id] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Payment_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [amount] BIGINT NOT NULL,
    [paymentDate] DATETIME2 NOT NULL,
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [Payment_status_df] DEFAULT 'PENDING',
    [invoiceId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Payment_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Resident] (
    [id] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Resident_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [fullName] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [password] NVARCHAR(1000) NOT NULL,
    [phone] NVARCHAR(1000) NOT NULL,
    [refreshToken] NVARCHAR(1000),
    [role] NVARCHAR(1000) NOT NULL CONSTRAINT [Resident_role_df] DEFAULT 'resident',
    CONSTRAINT [Resident_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Resident_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[Service] (
    [id] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Service_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [unitPrice] BIGINT NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Service_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Subscription] (
    [id] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Subscription_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [frequency] NVARCHAR(1000) NOT NULL,
    [nextBillingDate] DATETIME2 NOT NULL,
    [status] NVARCHAR(1000) NOT NULL,
    [serviceId] NVARCHAR(1000) NOT NULL,
    [apartmentId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Subscription_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[_NotificationToResident] (
    [A] NVARCHAR(1000) NOT NULL,
    [B] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [_NotificationToResident_AB_unique] UNIQUE NONCLUSTERED ([A],[B])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [_NotificationToResident_B_index] ON [dbo].[_NotificationToResident]([B]);

-- AddForeignKey
ALTER TABLE [dbo].[Apartment] ADD CONSTRAINT [Apartment_buildingId_fkey] FOREIGN KEY ([buildingId]) REFERENCES [dbo].[Building]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Apartment] ADD CONSTRAINT [Apartment_residentId_fkey] FOREIGN KEY ([residentId]) REFERENCES [dbo].[Resident]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Contract] ADD CONSTRAINT [Contract_residentId_fkey] FOREIGN KEY ([residentId]) REFERENCES [dbo].[Resident]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[InvoiceDetail] ADD CONSTRAINT [InvoiceDetail_serviceId_fkey] FOREIGN KEY ([serviceId]) REFERENCES [dbo].[Service]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[InvoiceDetail] ADD CONSTRAINT [InvoiceDetail_invoiceId_fkey] FOREIGN KEY ([invoiceId]) REFERENCES [dbo].[Invoice]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Invoice] ADD CONSTRAINT [Invoice_apartmentId_fkey] FOREIGN KEY ([apartmentId]) REFERENCES [dbo].[Apartment]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Payment] ADD CONSTRAINT [Payment_invoiceId_fkey] FOREIGN KEY ([invoiceId]) REFERENCES [dbo].[Invoice]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Subscription] ADD CONSTRAINT [Subscription_serviceId_fkey] FOREIGN KEY ([serviceId]) REFERENCES [dbo].[Service]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Subscription] ADD CONSTRAINT [Subscription_apartmentId_fkey] FOREIGN KEY ([apartmentId]) REFERENCES [dbo].[Apartment]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_NotificationToResident] ADD CONSTRAINT [_NotificationToResident_A_fkey] FOREIGN KEY ([A]) REFERENCES [dbo].[Notification]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_NotificationToResident] ADD CONSTRAINT [_NotificationToResident_B_fkey] FOREIGN KEY ([B]) REFERENCES [dbo].[Resident]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
